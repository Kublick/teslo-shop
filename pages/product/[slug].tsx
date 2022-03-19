import { useState } from 'react';
import { GetStaticPaths, NextPage, GetStaticProps } from 'next';
import { Button, Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideShow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';

import { IProduct, ICartProduct, ISize } from '../../interfaces';
import { dbProducts } from '../../database';

interface Props {
	product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		description: product.description,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});

	const onSelectedSize = (size: ISize) => {
		setTempCartProduct((currentProduct) => ({
			...currentProduct,
			size,
		}));
	};

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
							<SizeSelector
								sizes={product.sizes}
								selectedSize={tempCartProduct.size}
								onSelectedSize={onSelectedSize}
							/>
						</Box>

						{product.inStock > 0 ? (
							<Button color="secondary" className="circular-btn">
								{tempCartProduct.size
									? 'Agregar al carrito'
									: 'Seleccione una talla'}
							</Button>
						) : (
							<Chip
								label="No hay disponibles"
								variant="outlined"
								color="error"
							/>
						)}
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
