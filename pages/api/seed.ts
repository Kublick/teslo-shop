import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDatabase } from '../../database';
import { Product } from '../../models';

type Data = {
	message: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	if (process.env.NODE_ENV === 'production') {
		return res.status(401).json({ message: 'No tiene acceso al API' });
	}

	await db.connect();
	await Product.deleteMany();
	try {
		await Product.insertMany(seedDatabase.initialData.products);
	} catch (error) {
		console.log(error);
	}

	await db.disconnect();
	res.status(200).json({ message: 'Proceso realizado correctamente' });
}
