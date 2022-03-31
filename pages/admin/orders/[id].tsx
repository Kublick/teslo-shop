import {
	CreditScoreOutlined,
	CreditCardOutlined,
	AirplaneTicketOutlined,
} from '@mui/icons-material';
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
import { CardList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';

interface Props {
	order: IOrder;
}

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

	const { firstName, lastName, phone, zip, address, address2, city, country } =
		shippingAddress;

	return (
		<AdminLayout
			title={'Resumen de la orden'}
			subTitle={`orden #${_id}`}
			icon={<AirplaneTicketOutlined />}
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
								<Box flexDirection="column" display="flex">
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
											label="Orden no fue pagada"
											color="error"
											variant="outlined"
											icon={<CreditCardOutlined />}
										/>
									)}
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const { id = '' } = query;

	const order = await dbOrders.getOrderById(id.toString());

	if (!order) {
		return {
			redirect: {
				destination: '/admin/orders',
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
