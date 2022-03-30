import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
	const session: any = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	});
	const requestedPage = req.page.name;

	if (!session) {
		return NextResponse.redirect(
			`http://localhost:3000/auth/login?p=${requestedPage}`,
		);
	}

	const validRoles = ['admin', 'superadmin'];

	if (!validRoles.includes(session.user.role)) {
		return NextResponse.redirect('http://localhost:3000/');
	}

	return NextResponse.next();
}
