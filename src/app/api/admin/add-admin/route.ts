import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    
    // Only webmaster can add admins
    if (session?.user?.email !== 'webmaster@nitp.ac.in') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    try {
        const { email } = await request.json();
        const { db } = await connectToDatabase();
        
        await db.collection('admins').updateOne(
            { email },
            { $set: { email, addedBy: session.user.email, addedAt: new Date() } },
            { upsert: true }
        );

        return NextResponse.json({ message: 'Admin added successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add admin' }, { status: 500 });
    }
} 