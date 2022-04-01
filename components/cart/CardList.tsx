import {
	Box,
	Button,
	CardActionArea,
	CardMedia,
	Grid,
	Link,
	Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { ItemCounter } from '../ui';
import { ICartProduct, IOrderItem } from '../../interfaces';

interface Props {
	editable?: boolean;
	products?: IOrderItem[];
}

export const CardList: FC<Props> = ({ editable = false, products = [] }) => {
	const { cart, updateCartQuantity, removeCartProduct } =
		useContext(CartContext);

	const onNewCarQuantityValue = (
		product: ICartProduct,
		newQuantityValue: number,
	) => {
		product.quantity += newQuantityValue;
		updateCartQuantity(product);
	};

	const removeProduct = (product: ICartProduct) => {
		removeCartProduct(product);
	};

	const productsToShow = products.length >= 1 ? products : cart;

	return (
		<>
			{productsToShow.map((product) => (
				<Grid
					container
					key={product.slug + product.size}
					spacing={2}
					sx={{ mb: 1 }}
				>
					<Grid item xs={3}>
						{/* Llevar a la pag del producto */}
						<NextLink href={`product/${product.slug}`} passHref>
							<Link>
								<CardActionArea>
									<CardMedia
										image={`${product.image}`}
										component="img"
										alt={product.title}
										sx={{ bprderRadius: '5px' }}
									/>
								</CardActionArea>
							</Link>
						</NextLink>
					</Grid>

					<Grid item xs={7}>
						<Box display="flex" flexDirection="column">
							<Typography variant="body1">{product.title}</Typography>
							<Typography variant="body1">
								Talla: <strong>{product.size}</strong>
							</Typography>
							{/* Condicional */}
							{editable ? (
								<ItemCounter
									currentValue={product.quantity}
									updateQuantity={(value) => {
										onNewCarQuantityValue(product as ICartProduct, value);
									}}
									maxValue={10}
								/>
							) : (
								<Typography variant="h5">
									{product.quantity}{' '}
									{product.quantity > 1 ? 'productos' : 'producto'}{' '}
								</Typography>
							)}
						</Box>
					</Grid>

					<Grid
						item
						xs={2}
						display="flex"
						alignItems="center"
						flexDirection="column"
					>
						<Typography variant="subtitle1" color="secondary">
							${product.price}
						</Typography>
						{/* Editable */}
						{editable && (
							<Button
								variant="text"
								color="secondary"
								onClick={() => removeProduct(product as ICartProduct)}
							>
								Remover
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	);
};
