import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Link,
	Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { CardList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';
import { countries } from '../../utils';

const SummaryPage = () => {
	const { shippingAddress, numberOfItems, createOrder } =
		useContext(CartContext);

	const [isPosting, setIsPosting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const router = useRouter();

	useEffect(() => {
		if (!Cookies.get('firstName')) {
			router.push('/checkout/address');
		}
	}, [router]);

	if (!shippingAddress) {
		return <></>;
	}
	const { firstName, lastName, address, address2, zip, city, country, phone } =
		shippingAddress;

	const onCreateOrder = async () => {
		setIsPosting(true);

		const { hasError, message } = await createOrder(); //todo depende del resultado navegar o no

		if (hasError) {
			setIsPosting(false);
			setErrorMessage(message);
			return;
		}

		router.replace(`/orders/${message}`);
	};

	return (
		<ShopLayout
			title={'Resumen de orden'}
			pageDescription={'Resumen de la orden'}
		>
			<Typography variant="h1" component="h1">
				Resumen de la orden
			</Typography>
			<Grid container>
				<Grid item xs={12} sm={7}>
					<CardList />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2" component="h2">
								Resumen ({numberOfItems}{' '}
								{numberOfItems === 1 ? 'Producto' : 'Productos'})
							</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="end">
								<NextLink href="/checkout/address" passHref>
									<Link underline="always">Editar</Link>
								</NextLink>
							</Box>
							<Typography variant="subtitle1">Direccion de Entrega</Typography>
							<Typography>
								{firstName} {lastName}
							</Typography>
							<Typography>{address}</Typography>
							<Typography>{address2}</Typography>
							<Typography>
								{city}, {zip}
							</Typography>
							<Typography>
								{countries.find((c) => c.code === country)?.name}
							</Typography>
							<Typography>{phone}</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="end">
								<NextLink href="/cart" passHref>
									<Link underline="always">Editar</Link>
								</NextLink>
							</Box>

							<OrderSummary />
							<Box sx={{ mt: 3 }} display="flex" flexDirection="column">
								<Button
									color="secondary"
									className="circular-btn"
									fullWidth
									onClick={onCreateOrder}
									disabled={isPosting}
								>
									Confirmar Orden
								</Button>
								<Chip
									color="error"
									label={errorMessage}
									sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default SummaryPage;
