import { Chip, Grid, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import NextLink from 'next/link';

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
					<Link>{params.row.id}</Link>
				</NextLink>
			);
		},
	},
];

const rows = [
	{ id: 1, orderId: 1, paid: true, fullname: 'Juan Perez' },
	{ id: 2, orderId: 2, paid: true, fullname: 'Pedro Perez' },
	{ id: 3, orderId: 3, paid: false, fullname: 'Juan Perez' },
	{ id: 4, orderId: 4, paid: true, fullname: 'Alfonso Perez' },
	{ id: 5, orderId: 5, paid: false, fullname: 'Miguel Alonso Juarez' },
];

const HistoryPage = () => {
	return (
		<ShopLayout
			title={'Historial de ordenes'}
			pageDescription={'Historial ordenes del cliente'}
		>
			<Typography variant="h1" component="h1">
				Historial de ordenes
			</Typography>
			<Grid container>
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

export default HistoryPage;
