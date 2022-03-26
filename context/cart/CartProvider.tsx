import { FC, useEffect, useReducer } from 'react';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';
import tesloApi from '../../api/tesloApi';
import axios from 'axios';

export interface CartState {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	shippingAddress?: ShippingAddress;
}

const Cart_INITIAL_STATE: CartState = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,
	shippingAddress: undefined,
};

export const CartProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, Cart_INITIAL_STATE);

	useEffect(() => {
		try {
			const data = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
			dispatch({
				type: '[cart] - LoadCart from cookies | storage',
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: '[cart] - LoadCart from cookies | storage',
				payload: [],
			});
		}
	}, []);

	useEffect(() => {
		Cookie.set('cart', JSON.stringify(state.cart));
	}, [state.cart]);

	useEffect(() => {
		const numberOfItems = state.cart.reduce(
			(prev, current) => current.quantity + prev,
			0,
		);

		const subTotal = state.cart.reduce(
			(prev, current) => current.price * current.quantity + prev,
			0,
		);
		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

		const orderSummary = {
			numberOfItems,
			subTotal,
			tax: subTotal * taxRate,
			total: subTotal + subTotal * taxRate,
		};
		dispatch({
			type: '[cart] - Update Order Summary',
			payload: orderSummary,
		});
	}, [state.cart]);

	useEffect(() => {
		if (Cookie.get('firstName')) {
			const shippingAddress = {
				firstName: Cookie.get('firstName') || '',
				lastName: Cookie.get('lastName') || '',
				address: Cookie.get('address') || '',
				address2: Cookie.get('address2') || '',
				zip: Cookie.get('zip') || '',
				city: Cookie.get('city') || '',
				country: Cookie.get('country') || '',
				phone: Cookie.get('phone') || '',
			};
			dispatch({
				type: '[cart] - Load address from cookies | storage',
				payload: shippingAddress,
			});
		}
	}, []);

	const addProductToCart = (product: ICartProduct) => {
		const productInCart = state.cart.some((p) => p._id === product._id);

		if (!productInCart) {
			return dispatch({
				type: '[cart] - Update products in cart',
				payload: [...state.cart, product],
			});
		}

		const productInCartDifferentSize = state.cart.some(
			(p) => p._id === product._id && p.size === product.size,
		);

		if (!productInCartDifferentSize) {
			return dispatch({
				type: '[cart] - Update products in cart',
				payload: [...state.cart, product],
			});
		}

		//Acumular
		const upatedProducts = state.cart.map((p) => {
			if (p._id !== product._id) return p;
			if (p.size !== product.size) return p;
			//Actualizar Cantidad
			p.quantity += product.quantity;
			return p;
		});

		dispatch({
			type: '[cart] - Update products in cart',
			payload: upatedProducts,
		});
	};

	const updateCartQuantity = (product: ICartProduct) => {
		dispatch({
			type: '[cart] - Change product quantity',
			payload: product,
		});
	};

	const removeCartProduct = (product: ICartProduct) => {
		dispatch({
			type: '[cart] - Remove product from cart',
			payload: product,
		});
	};

	const updateAddress = (address: ShippingAddress) => {
		Cookie.set('firstName', address.firstName);
		Cookie.set('lastName', address.lastName);
		Cookie.set('address', address.address);
		Cookie.set('address2', address.address2 || '');
		Cookie.set('zip', address.zip);
		Cookie.set('city', address.city);
		Cookie.set('country', address.country);
		Cookie.set('phone', address.phone);

		dispatch({
			type: '[cart] - Update address from cookies | storage',
			payload: address,
		});
	};

	const createOrder = async (): Promise<{
		hasError: boolean;
		message: string;
	}> => {
		if (!state.shippingAddress) {
			throw new Error('No shipping address');
		}

		const body: IOrder = {
			orderItems: state.cart.map((p) => ({
				...p,
				size: p.size!,
			})),
			shippingAddress: state.shippingAddress,
			numberOfItems: state.numberOfItems,
			subTotal: state.subTotal,
			tax: state.tax,
			total: state.total,
			isPaid: false,
		};
		console.log(body);

		try {
			const { data } = await tesloApi.post<IOrder>('/orders', body);

			//TODO dispatch limpiar state

			return {
				hasError: false,
				message: data._id!,
			};

			console.log(data);
		} catch (error) {
			console.error(error);
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data.message,
				};
			}
			return {
				hasError: true,
				message: 'Error no controlado hable con el admin',
			};
		}
	};

	return (
		<CartContext.Provider
			value={{
				...state,
				addProductToCart,
				removeCartProduct,
				updateCartQuantity,
				updateAddress,
				createOrder,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
