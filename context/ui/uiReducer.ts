import { UiState } from './';

type UiActionType = { type: '[Ui] - ToogleMenu' };

export const uIReducer = (state: UiState, action: UiActionType): UiState => {
	switch (action.type) {
		case '[Ui] - ToogleMenu':
			return {
				...state,
				isMenuOpen: !state.isMenuOpen,
			};
		default:
			return state;
	}
};
