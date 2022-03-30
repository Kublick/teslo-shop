import {
	AccessTimeOutlined,
	AttachMoneyOutlined,
	CancelPresentationOutlined,
	CategoryOutlined,
	CreditCardOffOutlined,
	CreditCardOutlined,
	DashboardOutlined,
	GroupOutlined,
	ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts';
import { DashboardSummaryResponse } from '../../interfaces';

const DashBoardPage = () => {
	const { data, error } = useSWR<DashboardSummaryResponse>(
		'/api/admin/dashboard',
		{
			refreshInterval: 30 * 1000, // 30 seconds
		},
	);
	const [refreshIn, setRefreshIn] = useState(30);

	useEffect(() => {
		const interval = setInterval(() => {
			setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	if (!error && !data) {
		return <></>;
	}

	if (error) {
		console.log(error);
		return <Typography>Error al cargar la informacion</Typography>;
	}

	const {
		numberOfOrders,
		paidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInvetory,
		lowInventory,
		notPaidOrders,
	} = data!;

	return (
		<AdminLayout
			title="Dashboard"
			subTitle="Estadisticas Generales"
			icon={<DashboardOutlined />}
		>
			<Grid container spacing={2}>
				<SummaryTile
					title={numberOfOrders}
					subTitle="Ordenes totales"
					icon={<CreditCardOutlined sx={{ fontSize: 40 }} color="secondary" />}
				/>
				<SummaryTile
					title={paidOrders}
					subTitle="Ordenes pagadas"
					icon={<AttachMoneyOutlined sx={{ fontSize: 40 }} color="success" />}
				/>
				<SummaryTile
					title={notPaidOrders}
					subTitle="Ordenes pendientes"
					icon={<CreditCardOffOutlined sx={{ fontSize: 40 }} color="error" />}
				/>
				<SummaryTile
					title={numberOfClients}
					subTitle="Clientes"
					icon={<GroupOutlined sx={{ fontSize: 40 }} color="primary" />}
				/>
				<SummaryTile
					title={numberOfProducts}
					subTitle="Productos"
					icon={<CategoryOutlined sx={{ fontSize: 40 }} color="warning" />}
				/>
				<SummaryTile
					title={productsWithNoInvetory}
					subTitle="Sin Existencia"
					icon={
						<CancelPresentationOutlined sx={{ fontSize: 40 }} color="error" />
					}
				/>
				<SummaryTile
					title={lowInventory}
					subTitle="Bajo inventario"
					icon={
						<ProductionQuantityLimitsOutlined
							sx={{ fontSize: 40 }}
							color="warning"
						/>
					}
				/>
				<SummaryTile
					title={refreshIn}
					subTitle="Actualizacion en: "
					icon={<AccessTimeOutlined sx={{ fontSize: 40 }} color="secondary" />}
				/>
			</Grid>
		</AdminLayout>
	);
};

export default DashBoardPage;
