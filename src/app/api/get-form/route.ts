import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { db } = await connectToDatabase();
        
        // Get the latest form data for the user
        const formData = await db.collection('forms').findOne(
            { userId: session.user.email },
            { sort: { lastUpdated: -1 } }
        );

        if (!formData) {
            return NextResponse.json({ error: 'No form data found' }, { status: 404 });
        }

        return NextResponse.json(formData);
    } catch (error) {
        console.error('Error fetching form data:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 