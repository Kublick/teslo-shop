import axios from 'axios';
import Cookies from 'js-cookie';
import { FC, useEffect, useReducer } from 'react';
import tesloApi from '../../api/tesloApi';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export interface AuthState {
	isLoggedIn: boolean;
	user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined,
};

export const AuthProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);
	const router = useRouter();
	const { data, status } = useSession();

	useEffect(() => {
		if (status === 'authenticated') {
			dispatch({
				type: '[Auth] - Login',
				payload: data?.user as IUser,
			});
		}
		console.log(data?.user);
	}, [status, data]);

	// useEffect(() => {
	// 	checkToken();
	// }, []);

	// const checkToken = async () => {
	// 	if (Cookies.get('token') === undefined) return;
	// 	try {
	// 		const { data } = await tesloApi.get('/user/validate');
	// 		const { token, user } = data;
	// 		Cookies.set('token', token);
	// 		dispatch({ type: '[Auth] - Login', payload: user });
	// 	} catch (error) {
	// 		Cookies.remove('token');
	// 	}
	// };

	const loginUser = async (
		email: string,
		password: string,
	): Promise<boolean> => {
		try {
			const { data } = await tesloApi.post('/user/login', { email, password });
			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: '[Auth] - Login', payload: user });
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	};

	const registerUser = async (
		name: string,
		email: string,
		password: string,
	): Promise<{ hasError: boolean; message?: string }> => {
		try {
			console.log('desde reducer', { name, email, password });
			const { data } = await tesloApi.post('/user/register', {
				name,
				email,
				password,
			});

			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: '[Auth] - Login', payload: user });
			return {
				hasError: false,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data?.message,
				};
			}
			return {
				hasError: true,
				message: 'No se pudo crear el usuario - intente de nuevo',
			};
		}
	};

	const logoutUser = () => {
		Cookies.remove('token');
		Cookies.remove('cart');
		router.reload();
	};

	return (
		<AuthContext.Provider
			value={{
				...state,
				loginUser,
				registerUser,
				logoutUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
