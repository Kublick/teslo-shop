import { ICartProduct } from '../../interfaces';
import { CartState } from './';

type cartActionType = {
	type: '[cart] - LoadCart from cookies | storage';
	payload: ICartProduct[];
};

export const cartReducer = (
	state: CartState,
	action: cartActionType,
): CartState => {
	switch (action.type) {
		case '[cart] - LoadCart from cookies | storage':
			return {
				...state,
			};
		default:
			return state;
	}
};
