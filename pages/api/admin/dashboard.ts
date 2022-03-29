import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order } from "../../../models";

type Data =
  | {
      numberOfOrders: number;
      paidOrders: number; // isPaid true
      notPaidOrders: number;
      numberOfClients: number; // role client
      numberOfProducts: number;
      productsWithNoInvetory: number;
      lowInventory: number; // 10 o menos articulos
    }
  | { message: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getAllData(req, res);
  }

  res.status(200).json({ message: "Example" });
}
const getAllData = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const orders = await Order.find({});
    console.log("orders", orders);

    const numberOfOrders = orders.length;
    const paidOrders = orders.filter((order) => order.isPaid).length;
    const notPaidOrders = orders.filter((order) => !order.isPaid).length;
    // const numberOfClients = orders.filter(
    //   (order) => order.role === "client"
    // ).length;
    // const numberOfProducts = orders.reduce((prev, current) => {
    //   return prev + current.orderItems.length;
    // }, 0);
    // const productsWithNoInvetory = orders.reduce((prev, current) => {
    //   return (
    //     prev + current.orderItems.filter((item) => item.quantity <= 10).length
    //   );
    // }, 0);
    // const lowInventory = orders.reduce((prev, current) => {
    //   return (
    //     prev + current.orderItems.filter((item) => item.quantity <= 10).length
    //   );
    // }, 0);
    res.status(200).json({
      numberOfOrders,
      paidOrders,
      notPaidOrders,
      numberOfClients: 0,
      numberOfProducts: 0,
      productsWithNoInvetory: 0,
      lowInventory: 0,
    });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};
