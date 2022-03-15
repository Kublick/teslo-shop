import { CreditCardOutlined, CreditScoreOutlined } from '@mui/icons-material';
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Link,
	Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { CardList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

const OrderPage = () => {
	return (
		<ShopLayout
			title={'Resumen de la orden 1234'}
			pageDescription={'Resumen de la orden'}
		>
			<Typography variant="h1" component="h1">
				Orden #1234
			</Typography>
			{/* <Chip
				sx={{ my: 2 }}
				label="Pendiente de pago"
				color="error"
				variant="outlined"
				icon={<CreditCardOutlined />}
			/> */}
			<Chip
				sx={{ my: 2 }}
				label="Orden ya fue pagada"
				color="success"
				variant="outlined"
				icon={<CreditScoreOutlined />}
			/>
			<Grid container>
				<Grid item xs={12} sm={7}>
					<CardList />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2" component="h2">
								Resumen (3 Productos)
							</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="end">
								<NextLink href="/checkout/address" passHref>
									<Link underline="always">Editar</Link>
								</NextLink>
							</Box>
							<Typography variant="subtitle1">Direccion de Entrega</Typography>
							<Typography>Max</Typography>
							<Typography>Somewhere</Typography>
							<Typography>Mexicali, 21225</Typography>
							<Typography>Mexico</Typography>
							<Typography>+52 111111</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="end">
								<NextLink href="/cart" passHref>
									<Link underline="always">Editar</Link>
								</NextLink>
							</Box>

							<OrderSummary />
							<Box sx={{ mt: 3 }}>
								{/* TODO */}
								<h1>Pagar</h1>
								<Chip
									sx={{ my: 2 }}
									label="Orden ya fue pagada"
									color="success"
									variant="outlined"
									icon={<CreditScoreOutlined />}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default OrderPage;
