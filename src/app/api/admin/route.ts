import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    // Admin-only logic here
    return NextResponse.json({ message: 'Admin access granted' });
} 