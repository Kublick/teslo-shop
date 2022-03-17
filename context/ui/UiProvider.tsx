import { FC, useReducer } from 'react';
import { UIContext, uIReducer } from './';

export interface UiState {
	isMenuOpen: boolean;
}

const Ui_INITIAL_STATE: UiState = {
	isMenuOpen: false,
};

export const UiProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(uIReducer, Ui_INITIAL_STATE);

	const toggleSideMenu = () => {
		dispatch({ type: '[Ui] - ToogleMenu' });
	};

	return (
		<UIContext.Provider
			value={{
				...state,
				toggleSideMenu,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};
