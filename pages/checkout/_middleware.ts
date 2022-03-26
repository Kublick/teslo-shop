import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
	const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const requestedPage = req.page.name;
	console.log(session);

	if (!session) {
		return NextResponse.redirect(
			`http://localhost:3000/auth/login?p=${requestedPage}`,
		);
	}

	return NextResponse.next();
	// const { token = '' } = req.cookies;

	// try {
	// 	await jwt.isValidToken(token);
	// 	return NextResponse.next();
	// } catch (error) {
	// 	const requestedPage = req.page.name;

	// 	return NextResponse.redirect(
	// 		`http://localhost:3000/auth/login?p=${requestedPage}`,
	// 	);

	// 	// return NextResponse.redirect(
	// 	// 	new URL(`/auth/login?p=${requestedPage}`, req.url),
	// 	// );
	// }
}
