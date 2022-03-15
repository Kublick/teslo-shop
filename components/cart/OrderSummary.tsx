import { Grid, Typography } from '@mui/material';
import React from 'react';

export const OrderSummary = () => {
	return (
		<Grid container>
			<Grid item xs={6}>
				<Typography>No. de Productos</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="end">
				<Typography>3 items</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>Subtotal</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="end">
				<Typography>$155.36</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>Impuestos</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="end">
				<Typography>$18.35</Typography>
			</Grid>
			<Grid item xs={6} sx={{ mt: 2 }}>
				<Typography variant="subtitle1">Total:</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="end">
				<Typography variant="subtitle1">$188.35</Typography>
			</Grid>
		</Grid>
	);
};
