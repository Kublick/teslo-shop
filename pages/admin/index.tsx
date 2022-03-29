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
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import React from "react";
import { SummaryTile } from "../../components/admin";
import { AdminLayout } from "../../components/layouts";

const DashBoardPage = () => {
  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas Generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title="1"
          subTitle="Ordenes totales"
          icon={<CreditCardOutlined sx={{ fontSize: 40 }} color="secondary" />}
        />
        <SummaryTile
          title="2"
          subTitle="Ordenes pagadas"
          icon={<AttachMoneyOutlined sx={{ fontSize: 40 }} color="success" />}
        />
        <SummaryTile
          title="3"
          subTitle="Ordenes pendientes"
          icon={<CreditCardOffOutlined sx={{ fontSize: 40 }} color="error" />}
        />
        <SummaryTile
          title="4"
          subTitle="Clientes"
          icon={<GroupOutlined sx={{ fontSize: 40 }} color="primary" />}
        />
        <SummaryTile
          title="5"
          subTitle="Productos"
          icon={<CategoryOutlined sx={{ fontSize: 40 }} color="warning" />}
        />
        <SummaryTile
          title="6"
          subTitle="Sin Existencia"
          icon={
            <CancelPresentationOutlined sx={{ fontSize: 40 }} color="error" />
          }
        />
        <SummaryTile
          title="7"
          subTitle="Bajo inventario"
          icon={
            <ProductionQuantityLimitsOutlined
              sx={{ fontSize: 40 }}
              color="warning"
            />
          }
        />
        <SummaryTile
          title="8"
          subTitle="Actualizacion en: "
          icon={<AccessTimeOutlined sx={{ fontSize: 40 }} color="secondary" />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashBoardPage;
