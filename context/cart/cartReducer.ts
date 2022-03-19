import { ICartProduct } from '../../interfaces';
import { CartState } from './';

type cartActionType =
	| {
			type: '[cart] - LoadCart from cookies | storage';
			payload: ICartProduct[];
	  }
	| { type: '[cart] - Update products in cart'; payload: ICartProduct[] };

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

		default:
			return state;
	}
};
