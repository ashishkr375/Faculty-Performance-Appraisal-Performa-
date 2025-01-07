import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse(
                JSON.stringify({ error: 'Not authenticated' }),
                { status: 401 }
            );
        }

        const { db } = await connectToDatabase();
        const formData = await db.collection('forms').findOne({
            userId: session.user.email,
            academicYear: '2023-24'
        });

        if (!formData) {
            return NextResponse.json({
                isSubmitted: false,
                lastUpdated: new Date().toISOString(),
                totalMarks: 0,
                completedSteps: []
            });
        }

        return NextResponse.json({
            isSubmitted: formData.isSubmitted || false,
            lastUpdated: formData.lastUpdated || new Date().toISOString(),
            totalMarks: formData.totalMarks || 0,
            completedSteps: formData.completedSteps || []
        });
    } catch (error) {
        console.error('Error fetching form status:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
} 