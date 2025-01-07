import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/mongodb';
import { FormProgress } from '../../../models/FormProgress';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const formData = await FormProgress.findOne({
            email: session.user?.email
        });

        if (!formData) {
            return NextResponse.json(
                { error: 'No form data found' },
                { status: 404 }
            );
        }

        return NextResponse.json(formData);

    } catch (error) {
        console.error('Error fetching form data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch form data' },
            { status: 500 }
        );
    }
} 