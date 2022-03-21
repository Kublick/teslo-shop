import { useState } from 'react';
import {
	Box,
	Button,
	Grid,
	Link,
	TextField,
	Typography,
	Chip,
} from '@mui/material';
import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import tesloApi from '../../api/tesloApi';

type FormData = {
	email: string;
	password: string;
	name: string;
};

const RegisterPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	console.log(errors);

	const onRegisterForm = async ({ email, password, name }: FormData) => {
		try {
			const { data } = await tesloApi.post('/user/register', {
				email,
				password,
				name,
			});
		} catch (err) {
			console.log('Error todos los campos son requeridos');
			setShowError(true);
			setTimeout(() => {
				setShowError(false);
			}, 3000);
		}

		console.log({ email, password, name });
	};

	const [showError, setShowError] = useState(false);

	return (
		<AuthLayout title={'Registro'}>
			<form onSubmit={handleSubmit(onRegisterForm)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h1" component="h1">
								Crear Cuenta
							</Typography>

							<Chip
								sx={{ mt: 1, mb: 1, display: showError ? 'flex' : 'none' }}
								label="No puede ser utilizado ese coreo"
								color="error"
								icon={<ErrorOutline />}
								className="fadeIn"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Nombre completo"
								variant="filled"
								fullWidth
								{...register('name', {
									required: 'El nombre es requerido',
									minLength: {
										value: 2,
										message: 'El nombre debe tener al menos 2 caracteres',
									},
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
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
								Registrar
							</Button>
						</Grid>
						<Grid item xs={12} display="flex" justifyContent="end">
							<NextLink href="/auth/login" passHref>
								<Link underline="always">¿Ya tienes Cuenta?</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export default RegisterPage;
