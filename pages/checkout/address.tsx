import {
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { ShopLayout } from '../../components/layouts';
import { countries } from '../../utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { CartContext } from '../../context';
import { useContext, useEffect } from 'react';
// import { jwt } from '../../utils';
// import { GetServerSideProps } from 'next';

const getAddressFromCookies = (): FormData => {
	return {
		firstName: Cookies.get('firstName') || '',
		lastName: Cookies.get('lastName') || '',
		address: Cookies.get('address') || '',
		address2: Cookies.get('address2') || '',
		zip: Cookies.get('zip') || '',
		city: Cookies.get('city') || '',
		country: Cookies.get('country') || '',
		phone: Cookies.get('phone') || '',
	};
};

type FormData = {
	firstName: string;
	lastName: string;
	address: string;
	address2?: string;
	zip: string;
	city: string;
	country: string;
	phone: string;
};

const AddressPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<FormData>({
		defaultValues: getAddressFromCookies(),
	});

	useEffect(() => {
		reset(getAddressFromCookies());
	}, [reset]);

	const router = useRouter();
	const { updateAddress } = useContext(CartContext);

	const onRegisterForm = (data: FormData) => {
		updateAddress(data);
		router.push('/checkout/summary');
	};

	return (
		<ShopLayout
			title={'Direccion'}
			pageDescription={'Confirmar direccion del destino'}
		>
			<Typography variant="h1" component="h1">
				Direccion
			</Typography>
			<form onSubmit={handleSubmit(onRegisterForm)} noValidate>
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Nombre"
							variant="filled"
							fullWidth
							{...register('firstName', {
								required: 'El nombre es requerido',
								minLength: {
									value: 2,
									message: 'El nombre debe tener al menos 2 caracteres',
								},
							})}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Apellido"
							variant="filled"
							fullWidth
							{...register('lastName', {
								required: 'El nombre es requerido',
							})}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Direccion"
							variant="filled"
							fullWidth
							{...register('address', {
								required: 'La direccion es requerida',
							})}
							error={!!errors.address}
							helperText={errors.address?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Direccion 2 (opcional)"
							variant="filled"
							fullWidth
							{...register('address2')}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Codigo Postal"
							variant="filled"
							fullWidth
							{...register('zip', {
								required: 'El codigo postal es requerido',
							})}
							error={!!errors.zip}
							helperText={errors.zip?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Ciudad"
							variant="filled"
							fullWidth
							{...register('city', {
								required: 'La ciudad es requerida',
							})}
							error={!!errors.city}
							helperText={errors.city?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl variant="filled" fullWidth>
							<InputLabel>Pais</InputLabel>

							<Controller
								render={({ field }) => (
									<Select
										{...field}
										variant="filled"
										label="Pais"
										{...register('country', {
											required: 'El pais es requerido',
										})}
										error={!!errors.country}
									>
										{countries.map((country) => (
											<MenuItem key={country.code} value={country.code}>
												{country.name}
											</MenuItem>
										))}
									</Select>
								)}
								control={control}
								name="country"
								defaultValue={countries[0].name}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Telefono"
							variant="filled"
							fullWidth
							{...register('phone', {
								required: 'El telefono es requerido',
							})}
							error={!!errors.phone}
							helperText={errors.phone?.message}
						/>
					</Grid>
				</Grid>
				<Box sx={{ mt: 5 }} display="flex" justifyContent="center">
					<Button
						type="submit"
						color="secondary"
						className="circular-btn"
						size="large"
					>
						Revisar Pedido
					</Button>
				</Box>
			</form>
		</ShopLayout>
	);
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
// 	const { token = '' } = req.cookies;
// 	let isValidToken = false;

// 	try {
// 		await jwt.isValidToken(token);
// 		isValidToken = true;
// 	} catch (err) {
// 		isValidToken = false;
// 	}

// 	if (!isValidToken) {
// 		return {
// 			redirect: {
// 				destination: '/auth/login?p=/checkout/adddress',
// 				permanent: false,
// 			},
// 		};
// 	}

// 	return {
// 		props: {},
// 	};
// };

export default AddressPage;
