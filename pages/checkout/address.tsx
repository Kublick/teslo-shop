import {
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { ShopLayout } from '../../components/layouts';

const AddressPage = () => {
	return (
		<ShopLayout
			title={'Direccion'}
			pageDescription={'Confirmar direccion del destino'}
		>
			<Typography variant="h1" component="h1">
				Direccion
			</Typography>
			<Grid container spacing={2} sx={{ mt: 2 }}>
				<Grid item xs={12} sm={6}>
					<TextField label="Nombre" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Apellido" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Direccion" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label="Direccion 2 (opcional)"
						variant="filled"
						fullWidth
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Codigo Postal" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Ciudad" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl variant="filled" fullWidth>
						<InputLabel>Pais</InputLabel>
						<Select variant="filled" label="Pais" value={1}>
							<MenuItem value={1}>Argentina</MenuItem>
							<MenuItem value={2}>Mexico</MenuItem>
							<MenuItem value={1}>Honduras</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Telefono" variant="filled" fullWidth />
				</Grid>
			</Grid>
			<Box sx={{ mt: 5 }} display="flex" justifyContent="center">
				<Button color="secondary" className="circular-btn" size="large">
					Revisar Pedido
				</Button>
			</Box>
		</ShopLayout>
	);
};

export default AddressPage;
