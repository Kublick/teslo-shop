import { Button, Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideShow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
// import { GetServerSideProps, NextPage } from 'next';
import { IProduct } from '../../interfaces';
import { dbProducts } from '../../database';
import { GetStaticPaths, NextPage } from 'next';

import { GetStaticProps } from 'next';

interface Props {
	product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideShow images={product.images} />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Box display="flex" flexDirection="column">
						{/* titulos */}
						<Typography variant="h1" component="h1">
							{product.title}
						</Typography>
						<Typography variant="subtitle1" component="h2">
							${product.price}
						</Typography>
						{/* Cantidad */}
						<Box sx={{ my: 2 }}>
							<Typography variant="subtitle2">Cantidad</Typography>
							<ItemCounter />
							<SizeSelector sizes={product.sizes} />
						</Box>
						<Button color="secondary" className="circular-btn">
							Agregar al carrito
						</Button>
						{/* <Chip label="No hay disponibles" variant="outlined" /> */}
						{/* Descripcion */}
						<Box sx={{ mt: 3 }}>
							<Typography variant="subtitle2">Descripcion</Typography>
							<Typography variant="body2">{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async () => {
	const productSlugs = await dbProducts.getAllProductsSlugs();

	return {
		paths: productSlugs.map(({ slug }) => ({
			params: { slug },
		})),
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug = '' } = params as { slug: string };

	const product = await dbProducts.getProductBySlug(slug);

	if (!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			product,
		},
		revalidate: 86400,
	};
};

// Cuando se utiliza Server Side Rendering para generar las paginas.
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
// 	const { slug = '' } = params as { slug: string };
// 	const product = await dbProducts.getProductBySlug(slug);

// if (!product) {
// 	return {
// 		redirect: {
// 			destination: '/',
// 			permanent: false,
// 		},
// 	};
// }
// 	return {
// 		props: {
// 			product,
// 		},
// 	};
// };

export default ProductPage;
