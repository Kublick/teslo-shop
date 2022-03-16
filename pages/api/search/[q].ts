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
			return serachProducts(req, res);
		default:
			return res.status(400).json({ message: 'Bad Request' });
	}
}

const serachProducts = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) => {
	let { q = '' } = req.query;

	if (q.length === 0)
		return res
			.status(400)
			.json({ message: 'Debe de especificar el query de busqueda' });

	q = q.toString().toLowerCase();

	db.connect();

	const productos = await Product.find({
		$text: { $search: q },
	})
		.select('title images price inStock slug -_id')
		.lean();

	db.disconnect();

	return res.status(200).json(productos);
};
