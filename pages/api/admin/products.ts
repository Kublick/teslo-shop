import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';

type Data =
	| {
			message: string;
	  }
	| IProduct[]
	| IProduct;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	switch (req.method) {
		case 'GET':
			return getProducts(req, res);

		case 'PUT':
			return updateProduct(req, res);

		case 'POST':
			return createProduct(req, res);

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
async function updateProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { _id = '', images } = req.body as IProduct;

	if (!isValidObjectId(_id)) {
		return res.status(400).json({ message: 'Invalid ID' });
	}

	if (images.length < 2) {
		return res.status(400).json({ message: 'Es necesario 2 imagenes' });
	}

	try {
		await db.connect();

		const product = await Product.findById(_id);
		if (!product) {
			return res.status(400).json({ message: 'Producto no encontrado' });
		}

		// TODO de elimninar imagenes en Cloudinary

		await product.update(req.body);

		await db.disconnect();

		return res.status(200).json(product);
	} catch (error) {
		console.log(error);
		await db.disconnect();
		return res
			.status(400)
			.json({ message: `Error al actualizar producto ${_id}` });
	}

	// TODO posibmente tendremos un localhost:3000/products/asdasd.jpg
}
async function createProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { images = [] } = req.body as IProduct;

	if (images.length < 2) {
		return res.status(400).json({ message: 'Es necesario 2 imagenes' });
	}

	try {
		await db.connect();

		const productInDB = await Product.findOne({ title: req.body.slug });

		if (productInDB) {
			return res.status(400).json({ message: 'Producto ya existe' });
		}

		const product = new Product(req.body);
		await product.save();
		await db.disconnect();
		res.status(201).json(product);
	} catch (error) {
		await db.disconnect();
		return res.status(400).json({ message: 'Revisar logs del servidor' });
	}
}
