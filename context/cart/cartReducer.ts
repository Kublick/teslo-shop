import { ICartProduct } from '../../interfaces';
import { CartState } from './';

type cartActionType =
	| {
			type: '[cart] - LoadCart from cookies | storage';
			payload: ICartProduct[];
	  }
	| { type: '[cart] - Update products in cart'; payload: ICartProduct[] }
	| { type: '[cart] - Change product quantity'; payload: ICartProduct }
	| { type: '[cart] - Remove product from cart'; payload: ICartProduct };

export const cartReducer = (
	state: CartState,
	action: cartActionType,
): CartState => {
	switch (action.type) {
		case '[cart] - LoadCart from cookies | storage':
			return {
				...state,
				cart: [...action.payload],
			};
		case '[cart] - Update products in cart':
			return {
				...state,
				cart: [...action.payload],
			};
		case '[cart] - Change product quantity':
			return {
				...state,
				cart: state.cart.map((product) => {
					if (product._id !== action.payload._id) return product;
					if (product.size !== action.payload.size) return product;
					return action.payload;
				}),
			};
		case '[cart] - Remove product from cart':
			return {
				...state,
				cart: state.cart.filter(
					(product) =>
						!(
							product._id === action.payload._id &&
							product.size === action.payload.size
						),
				),
			};

		default:
			return state;
	}
};
