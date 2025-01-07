import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { step, data } = body;

        if (!step || !data) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        
        // First, check if document exists and its structure
        const existingDoc = await db.collection('forms').findOne({
            userId: session.user.email,
            academicYear: '2023-24'
        });

        if (!existingDoc) {
            // Create new document with proper array structure
            const result = await db.collection('forms').insertOne({
                userId: session.user.email,
                academicYear: '2023-24',
                completedSteps: [parseInt(step.toString())],
                [`step${step}`]: data,
                lastUpdated: new Date()
            });

            if (!result.acknowledged) {
                throw new Error('Failed to create document');
            }
        } else {
            // Update existing document
            let updateOperation;
            
            if (typeof existingDoc.completedSteps === 'object' && !Array.isArray(existingDoc.completedSteps)) {
                // If completedSteps is an object, convert it to array
                const stepsArray = Object.keys(existingDoc.completedSteps).map(Number);
                updateOperation = {
                    $set: {
                        [`step${step}`]: data,
                        lastUpdated: new Date(),
                        completedSteps: [...new Set([...stepsArray, parseInt(step.toString())])]
                    }
                };
            } else {
                // If completedSteps is already an array or doesn't exist
                updateOperation = {
                    $set: {
                        [`step${step}`]: data,
                        lastUpdated: new Date()
                    },
                    $addToSet: {
                        completedSteps: parseInt(step.toString())
                    }
                };
            }

            const result = await db.collection('forms').updateOne(
                { 
                    userId: session.user.email,
                    academicYear: '2023-24'
                },
                updateOperation
            );

            if (!result.acknowledged) {
                throw new Error('Failed to update document');
            }
        }

        return NextResponse.json({ 
            success: true,
            message: 'Data saved successfully'
        });

    } catch (error) {
        console.error('Error saving form data:', error);
        return NextResponse.json(
            { 
                error: 'Failed to save form data',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
