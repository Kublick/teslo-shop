import { ShopLayout } from '../../components/layouts';
import { Typography } from '@mui/material';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const MenPage = () => {
	const { products, isLoading } = useProducts('/products?gender=men');
	return (
		<ShopLayout title="Men" pageDescription="Categoria Mens">
			<Typography variant="h1" component="h1">
				Men
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default MenPage;
