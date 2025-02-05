import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    async function middleware(req) {
        const url = req.nextUrl;
        const session = req.cookies.get("next-auth.session-token");
        const pathname = url.pathname;
        if (pathname.startsWith("/auth/signin")) {
            return NextResponse.next();
        }
        if (!session) {
            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }
        const progressRes = await fetch(`${req.nextUrl.origin}/api/get-progress`, {
            headers: {
                Cookie: `next-auth.session-token=${session.value}`
            },
        });
        if (!progressRes.ok) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        const progressData = await progressRes.json();
        const completedSteps = progressData.completedSteps;

        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
            return NextResponse.next();
        }

        const stepMatch = pathname.match(/^\/form\/step(\d+)$/);
        if (stepMatch) {
            const stepNumber = parseInt(stepMatch[1], 10);

            if (stepNumber !== 1 && !completedSteps.includes(stepNumber - 1)) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

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
    matcher: ['/form/:path*', '/admin/:path*', '/dashboard', '/auth/signin']
};