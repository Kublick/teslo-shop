import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

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
	res: NextApiResponse<Data>,
) {
	switch (req.method) {
		case 'GET':
			return getAllData(req, res);
	}

	res.status(200).json({ message: 'Example' });
}
const getAllData = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	try {
		await db.connect();
		const [orders, clients, products] = await Promise.all([
			Order.find({}),
			User.find({ role: 'client' }),
			Product.find({}),
		]);

		await db.disconnect();

		const numberOfOrders = orders.length;
		const paidOrders = orders.filter((order) => order.isPaid).length;
		const notPaidOrders = orders.filter((order) => !order.isPaid).length;

		const numberOfClients = clients.filter(
			(order) => order.role === 'client',
		).length;

		const numberOfProducts = products.length;

		const productsWithNoInvetory = products.filter(
			(product) => product.inStock === 0,
		).length;

		const lowInventory = products.filter(
			(product) => product.inStock <= 10,
		).length;

		res.status(200).json({
			numberOfOrders,
			paidOrders,
			notPaidOrders,
			numberOfClients,
			numberOfProducts,
			productsWithNoInvetory,
			lowInventory,
		});
	} catch (error) {
		res.status(500).json({ message: 'error' });
	}
};
