import { useState } from 'react';
import {
	Box,
	Button,
	Chip,
	Grid,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
import tesloApi from '../../api/tesloApi';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
	email: string;
	password: string;
};

const LoginPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const [showError, setShowError] = useState(false);

	const onLoginUser = async ({ email, password }: FormData) => {
		setShowError(false);
		try {
			const { data } = await tesloApi.post('/user/login', { email, password });
			const { token, user } = data;
			console.log({ token, user });
		} catch (err) {
			console.log('Error en las crendenciales');
			setShowError(true);
			setTimeout(() => {
				setShowError(false);
			}, 3000);
		}
	};

	return (
		<AuthLayout title={'Ingresar'}>
			<form onSubmit={handleSubmit(onLoginUser)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h1" component="h1">
								Iniciar Sesion
							</Typography>

							<Chip
								sx={{ mt: 1, mb: 1, display: showError ? 'flex' : 'none' }}
								label="No reconocemos ese usuario / contraseña"
								color="error"
								icon={<ErrorOutline />}
								className="fadeIn"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type="email"
								label="Correo"
								variant="filled"
								fullWidth
								{...register('email', {
									required: 'El correo es requerido',
									validate: (value) => validations.isEmail(value),
								})}
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								label="Contraseña"
								type="password"
								variant="filled"
								fullWidth
								{...register('password', {
									required: 'La contraseña es requerida',
									minLength: { value: 6, message: 'Minimo 6 caracteres' },
								})}
								error={!!errors.password}
								helperText={errors.password?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								color="secondary"
								className="circular-btn"
								size="large"
								fullWidth
							>
								Ingresar
							</Button>
						</Grid>
						<Grid item xs={12} display="flex" justifyContent="end">
							<NextLink href="/auth/register" passHref>
								<Link underline="always">¿No tienes Cuenta?</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export default LoginPage;
