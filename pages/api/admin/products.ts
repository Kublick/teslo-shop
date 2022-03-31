import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
	| {
			message: string;
	  }
	| IProduct[];

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	switch (req.method) {
		case 'GET':
			return getProducts(req, res);

		case 'POST':
		case 'PUT':

		default:
			res.status(400).json({ message: 'Bad Request' });
	}

	res.status(200).json({ message: 'Example' });
}
async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
	await db.connect();
	const products = await Product.find().sort({ title: 1 }).lean();
	await db.disconnect();
	//TODO actualizar imagenes

	res.status(200).json(products);
}
