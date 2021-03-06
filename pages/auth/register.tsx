import { useState, useContext } from 'react';
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
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';

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

	const { registerUser } = useContext(AuthContext);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const onRegisterForm = async ({ name, email, password }: FormData) => {
		setShowError(false);

		const { hasError, message } = await registerUser(name, email, password);

		if (hasError) {
			setShowError(true);
			setErrorMessage(message!);
			setTimeout(() => {
				setShowError(false);
				setErrorMessage('');
			}, 3000);
			return;
		}

		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);

		await signIn('credentials', { email, password });
	};

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
								label="Contrase??a"
								type="password"
								variant="filled"
								fullWidth
								{...register('password', {
									required: 'La contrase??a es requerida',
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
							<NextLink
								href={
									router.query.p
										? `/auth/login/${router.query.p}`
										: '/auth/login'
								}
								passHref
							>
								<Link underline="always">??Ya tienes Cuenta?</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const session = await getSession({ req });

	const { p = '/' } = query;

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};

export default RegisterPage;
