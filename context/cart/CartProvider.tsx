import { FC, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
	cart: ICartProduct[];
}

const Cart_INITIAL_STATE: CartState = {
	cart: [],
};

export const CartProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, Cart_INITIAL_STATE);

	const addProductToCart = (product: ICartProduct) => {
		const productInCart = state.cart.some((p) => p._id === product._id);

		if (!productInCart) {
			return dispatch({
				type: '[cart] - Update products in cart',
				payload: [...state.cart, product],
			});
		}

		const productInCartDiffentSize = state.cart.some(
			(p) => p._id === product._id && p.size === product.size,
		);

		if (!productInCartDiffentSize) {
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

	return (
		<CartContext.Provider
			value={{
				...state,
				addProductToCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
