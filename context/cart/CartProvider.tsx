import { FC, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';
export interface CartState {
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
}

const Cart_INITIAL_STATE: CartState = {
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,
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

	return (
		<CartContext.Provider
			value={{
				...state,
				addProductToCart,
				removeCartProduct,
				updateCartQuantity,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
