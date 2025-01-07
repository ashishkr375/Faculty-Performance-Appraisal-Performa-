import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const step = request.nextUrl.searchParams.get('step');
        if (!step) {
            return NextResponse.json(
                { error: 'Step parameter is required' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const form = await db.collection('forms').findOne(
            { 
                userId: session.user.email,
                academicYear: '2023-24'
            }
        );

        // Ensure we return a serializable object
        const stepData = form ? form[`step${step}`] : {};
        return NextResponse.json(JSON.parse(JSON.stringify(stepData)));

    } catch (error) {
        console.error('Error fetching form data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch form data' },
            { status: 500 }
        );
    }
}
