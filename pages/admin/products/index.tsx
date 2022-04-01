import { AdminLayout } from '../../../components/layouts';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import useSWR from 'swr';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IProduct } from '../../../interfaces';
import NextLink from 'next/link';

// TODO

const columns: GridColDef[] = [
	{
		field: 'img',
		headerName: 'Foto',
		renderCell: ({ row }: GridRenderCellParams) => {
			return (
				<a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
					<CardMedia component="img" className="fadeIn" image={`${row.img}`} />
				</a>
			);
		},
	},
	{
		field: 'title',
		headerName: 'Titulo',
		width: 250,
		renderCell: ({ row }: GridRenderCellParams) => {
			return (
				<NextLink href={`/admin/products/${row.slug}`} passHref>
					<Link>{row.title}</Link>
				</NextLink>
			);
		},
	},
	{ field: 'gender', headerName: 'Genero' },
	{ field: 'type', headerName: 'Tipo' },
	{ field: 'inStock', headerName: 'Inventario' },
	{ field: 'price', headerName: 'Precio' },
	{ field: 'sizes', headerName: 'Tallas' },
];

const ProductsPage = () => {
	const { data, error } = useSWR<IProduct[]>('/api/admin/products');

	if (!data && !error) return <></>;

	const rows = data!.map((product) => ({
		id: product._id,
		img: product.images[0],
		title: product.title,
		gender: product.gender,
		type: product.type,
		inStock: product.inStock,
		prices: product.price,
		sizes: product.sizes.join(', '),
		slug: product.slug,
	}));

	return (
		<AdminLayout
			title={`Productros (${data?.length})`}
			subTitle={'Mantenimiento de Productos'}
			icon={<CategoryOutlined />}
		>
			<Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
				<Button
					startIcon={<AddOutlined />}
					color="secondary"
					href="/admin/products/new"
				>
					Crear Producto
				</Button>
			</Box>
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

export default ProductsPage;
