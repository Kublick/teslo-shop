import { createContext } from 'react';
import { IUser } from '../../interfaces';

interface ContextProps {
	isLoggedIn: boolean;
	user?: IUser;
	loginUser: (email: string, password: string) => Promise<boolean>;
	registerUser: (
		name: string,
		password: string,
		email: string,
	) => Promise<{ hasError: boolean; message?: string }>;
	logoutUser: () => void;
}

export const AuthContext = createContext({} as ContextProps);
