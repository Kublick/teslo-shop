import { Chip, Grid, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'fullname', headerName: 'Nombre Completo', width: 300 },
	{
		field: 'paid',
		headerName: 'Pagada',
		width: 200,
		description: 'Muestra informacion si esta pagada la orden o no',
		renderCell: (params: GridRenderCellParams) => {
			return params.row.paid ? (
				<Chip label="Pagada" color="success" variant="outlined" />
			) : (
				<Chip label="No Pagada" color="error" variant="outlined" />
			);
		},
	},
	{
		field: 'orderId',
		headerName: 'Ver Orden',
		width: 200,
		sortable: false,
		renderCell: (params: GridRenderCellParams) => {
			return (
				<NextLink href={`/orders/${params.row.orderId}`} passHref>
					<Link underline="always">Ver Orden</Link>
				</NextLink>
			);
		},
	},
];

interface Props {
	orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
	let rows = orders.map((order, index) => {
		return {
			id: index + 1,
			paid: order.isPaid,
			fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
			orderId: order._id,
		};
	});
	return (
		<ShopLayout
			title={'Historial de ordenes'}
			pageDescription={'Historial ordenes del cliente'}
		>
			<Typography variant="h1" component="h1">
				Historial de ordenes
			</Typography>
			<Grid container className="fadeIn">
				<Grid item xs={12} sx={{ heigth: '650px', width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
						autoHeight
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session: any = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: 'auth//loginp=/orders/history',
				permanent: false,
			},
		};
	}

	const orders = await dbOrders.getOrdersByUser(session.user._id);

	return {
		props: {
			id: session.user._id,
			orders,
		},
	};
};

export default HistoryPage;
