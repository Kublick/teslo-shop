import { CreditScoreOutlined, CreditCardOutlined } from '@mui/icons-material';
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
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { CardList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
	console.log(order);
	const {
		_id,
		numberOfItems,
		isPaid,
		shippingAddress,
		orderItems,
		subTotal,
		total,
		tax,
	} = order;

	const { firstName, lastName, phone, zip, address, address2, city, country } =
		shippingAddress;

	return (
		<ShopLayout
			title={'Resumen de la orden'}
			pageDescription={'Resumen de la orden'}
		>
			<Typography variant="h1" component="h1">
				{_id}
			</Typography>
			{isPaid ? (
				<Chip
					sx={{ my: 2 }}
					label="Orden ya fue pagada"
					color="success"
					variant="outlined"
					icon={<CreditScoreOutlined />}
				/>
			) : (
				<Chip
					sx={{ my: 2 }}
					label="Pendiente de pago"
					color="error"
					variant="outlined"
					icon={<CreditCardOutlined />}
				/>
			)}

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CardList products={orderItems} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2" component="h2">
								Resumen ({numberOfItems}{' '}
								{numberOfItems === 1 ? 'Producto' : 'Productos'} )
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
							<Typography>
								{address} {address2 ? `${address2}` : ''}
							</Typography>

							<Typography>
								{city}, {zip}
							</Typography>
							<Typography>{country}</Typography>
							<Typography>{phone}</Typography>
							<Divider sx={{ my: 1 }} />

							<OrderSummary
								orderValues={{
									numberOfItems: numberOfItems,
									subTotal: subTotal,
									total: total,
									tax: tax,
								}}
							/>
							<Box sx={{ mt: 3 }} display="flex" flexDirection="column">
								{/* TODO */}
								{isPaid ? (
									<Chip
										sx={{ my: 2 }}
										label="Orden ya fue pagada"
										color="success"
										variant="outlined"
										icon={<CreditScoreOutlined />}
									/>
								) : (
									<h1>Pagar</h1>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const { id = '' } = query;

	const session: any = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false,
			},
		};
	}

	const order = await dbOrders.getOrderById(id.toString());

	if (!order) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false,
			},
		};
	}

	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false,
			},
		};
	}

	return {
		props: {
			order,
		},
	};
};

export default OrderPage;
