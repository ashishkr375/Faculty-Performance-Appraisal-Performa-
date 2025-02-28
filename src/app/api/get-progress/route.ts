import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    try {
        const { db } = await connectToDatabase();
        const formData = await db.collection('forms').findOne(
            { userId: session.user.email },
            { projection: { completedSteps: 1, lastUpdated: 1,finalSubmit:1 } }
        );

        if (!formData) {
            return NextResponse.json({ completedSteps: [], lastUpdated: null });
        }

        return NextResponse.json(formData);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 