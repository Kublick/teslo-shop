import { CreditScoreOutlined, CreditCardOutlined } from '@mui/icons-material';
import {
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Divider,
	Grid,
	Link,
	Typography,
} from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { CardList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import tesloApi from '../../api/tesloApi';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface Props {
	order: IOrder;
}

export type OrderResponseBody = {
	id: string;
	status:
		| 'COMPLETED'
		| 'SAVED'
		| 'APPROVED'
		| 'VOIDED'
		| 'PAYER_ACTION_REQUIRED';
};

const OrderPage: NextPage<Props> = ({ order }) => {
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

	const [isPaying, setIsPaying] = useState(false);

	const router = useRouter();

	const { firstName, lastName, phone, zip, address, address2, city, country } =
		shippingAddress;

	const onOrderCompleted = async (details: OrderResponseBody) => {
		if (details.status !== 'COMPLETED') {
			return alert('No hay pago en paypal');
		}
		setIsPaying(true);

		try {
			const { data } = await tesloApi.post(`/orders/pay`, {
				transactionId: details.id,
				orderId: _id,
			});
			router.reload();
		} catch (error) {
			setIsPaying(false);
			console.log(error);
			alert(error);
		}
	};

	return (
		<ShopLayout
			title={'Resumen de la orden'}
			pageDescription={'Resumen de la orden'}
		>
			<Typography variant="h1" component="h1">
				Order: {_id}
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

			<Grid container className="fadeIn">
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
								<Box
									display="flex"
									justifyContent="center"
									className="fadeIn"
									sx={{ display: isPaying ? 'flex' : 'none' }}
								>
									<CircularProgress />
								</Box>

								<Box
									flexDirection="column"
									sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
								>
									{isPaid ? (
										<Chip
											sx={{ my: 2 }}
											label="Orden ya fue pagada"
											color="success"
											variant="outlined"
											icon={<CreditScoreOutlined />}
										/>
									) : (
										<PayPalButtons
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																value: `${order.total}`,
															},
														},
													],
												});
											}}
											onApprove={(data, actions) => {
												return actions.order!.capture().then((details) => {
													onOrderCompleted(details);
													// console.log({ details });
												});
											}}
										/>
									)}
								</Box>
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
