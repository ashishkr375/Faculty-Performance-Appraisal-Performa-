import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { FormSubmission } from '@/models/FormSubmission';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.json();

        await connectToDatabase();

        // Create final submission
        await FormSubmission.create({
            email: session.user?.email,
            data: formData,
            submittedAt: new Date()
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error submitting form:', error);
        return NextResponse.json(
            { error: 'Failed to submit form' },
            { status: 500 }
        );
    }
}
