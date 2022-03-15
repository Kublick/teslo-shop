import { Typography } from '@mui/material';
import React, { FC } from 'react';
import { initialData } from '../../database/products';

interface Props {}

const productsInCart = [
	initialData.products[0],
	initialData.products[1],
	initialData.products[2],
];

export const CardList: FC<Props> = () => {
	return (
		<>
			{productsInCart.map((product) => (
				<Typography key={product.slug}>{product.title}</Typography>
			))}
		</>
	);
};
