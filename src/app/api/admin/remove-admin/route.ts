import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    
    // Only webmaster can remove admins
    if (session?.user?.email !== 'webmaster@nitp.ac.in') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    try {
        const { email } = await request.json();
        
        // Prevent removing webmaster
        if (email === 'webmaster@nitp.ac.in') {
            return NextResponse.json({ error: 'Cannot remove webmaster' }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        await db.collection('admins').deleteOne({ email });

        return NextResponse.json({ message: 'Admin removed successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove admin' }, { status: 500 });
    }
} 