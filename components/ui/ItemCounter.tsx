import { FC } from 'react';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
	currentValue: number;
	updateQuantity: (quantity: number) => void;
	maxValue: number;
}

export const ItemCounter: FC<Props> = ({
	currentValue,
	updateQuantity,
	maxValue,
}) => {
	const handeUpdate = (value: number) => {
		if (currentValue <= 1 && value === -1) {
			return;
		}

		if (currentValue >= maxValue && value === 1) {
			return;
		}
		return updateQuantity(value);
	};

	return (
		<Box display="flex" alignItems="center">
			<IconButton onClick={() => handeUpdate(-1)}>
				<RemoveCircleOutline />
			</IconButton>
			<Typography sx={{ width: 40, textAlign: 'center' }}>
				{currentValue}
			</Typography>
			<IconButton onClick={() => handeUpdate(1)}>
				<AddCircleOutline />
			</IconButton>
		</Box>
	);
};
