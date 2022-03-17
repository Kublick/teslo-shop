import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const KidPage = () => {
	const { products, isLoading } = useProducts('/products?gender=kid');

	return (
		<ShopLayout title="Kids" pageDescription="Categoria Kids">
			<Typography variant="h1" component="h1">
				Kid
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default KidPage;
