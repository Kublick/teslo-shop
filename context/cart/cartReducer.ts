import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartState } from './';

type cartActionType =
	| {
			type: '[cart] - LoadCart from cookies | storage';
			payload: ICartProduct[];
	  }
	| { type: '[cart] - Update products in cart'; payload: ICartProduct[] }
	| { type: '[cart] - Change product quantity'; payload: ICartProduct }
	| { type: '[cart] - Remove product from cart'; payload: ICartProduct }
	| {
			type: '[cart] - Load address from cookies | storage';
			payload: ShippingAddress;
	  }
	| {
			type: '[cart] - Update address from cookies | storage';
			payload: ShippingAddress;
	  }
	| {
			type: '[cart] - Update Order Summary';
			payload: {
				numberOfItems: number;
				subTotal: number;
				tax: number;
				total: number;
			};
	  }
	| { type: '[Cart] - Order Complete' };

export const cartReducer = (
	state: CartState,
	action: cartActionType,
): CartState => {
	switch (action.type) {
		case '[cart] - LoadCart from cookies | storage':
			return {
				...state,
				isLoaded: true,
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
		case '[cart] - Update Order Summary':
			return {
				...state,
				...action.payload,
			};
		case '[cart] - Update address from cookies | storage':
		case '[cart] - Load address from cookies | storage':
			return {
				...state,
				shippingAddress: action.payload,
			};
		case '[Cart] - Order Complete':
			return {
				...state,
				cart: [],
				numberOfItems: 0,
				subTotal: 0,
				tax: 0,
				total: 0,
			};

		default:
			return state;
	}
};
