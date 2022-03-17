import { ShopLayout } from '../../components/layouts';
import { Typography } from '@mui/material';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const WomenPage = () => {
	const { products, isLoading } = useProducts('/products?gender=women');
	return (
		<ShopLayout title="Women" pageDescription="Categoria Women">
			<Typography variant="h1" component="h1">
				Women
			</Typography>
			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default WomenPage;
