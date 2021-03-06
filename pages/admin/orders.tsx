import { AdminLayout } from '../../components/layouts';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import useSWR from 'swr';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IOrder, IUser } from '../../interfaces';

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'Orden ID', width: 250 },
	{ field: 'email', headerName: 'Correo', width: 250 },
	{ field: 'name', headerName: 'Nombre Completo', width: 300 },
	{ field: 'total', headerName: 'Monto Total', width: 300 },
	{
		field: 'isPaid',
		headerName: 'Pagada',
		renderCell: ({ row }: GridRenderCellParams) => {
			return (
				<>
					{row.isPaid ? (
						<Chip variant="outlined" label="Pagada" color="success" />
					) : (
						<Chip variant="outlined" label="No pagada" color="error" />
					)}
				</>
			);
		},
	},
	{
		field: 'noProducts',
		headerName: 'No. Productos',
		align: 'center',
		width: 150,
	},
	{
		field: 'check',
		headerName: 'Ver Orden',
		renderCell: ({ row }: GridRenderCellParams) => {
			return (
				<a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
					Ver Orden
				</a>
			);
		},
	},
	{ field: 'createdAt', headerName: 'Fecha de Creacion', width: 300 },
];

const Orders = () => {
	const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

	if (!data && !error) return <></>;

	console.log(data);

	const rows = data!.map((order) => ({
		id: order._id,
		email: (order.user as IUser).email,
		name: (order.user as IUser).name,
		total: order.total,
		isPaid: order.isPaid,
		noProducts: order.numberOfItems,
		createdAt: order.createdAt,
	}));

	return (
		<AdminLayout
			title={'Ordenes'}
			subTitle={'Mantenimiento de Ordenes'}
			icon={<ConfirmationNumberOutlined />}
		>
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
		</AdminLayout>
	);
};

export default Orders;
