import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: ['/form/:path*', '/admin/:path*', '/dashboard']
}; 