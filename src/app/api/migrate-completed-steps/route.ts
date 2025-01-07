import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(_request: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        
        const cursor = db.collection('forms').find({
            completedSteps: { $type: 'object' }
        });

        let migratedCount = 0;
        
        for await (const doc of cursor) {
            const stepsArray = Object.keys(doc.completedSteps).map(Number);
            await db.collection('forms').updateOne(
                { _id: doc._id },
                {
                    $set: {
                        completedSteps: [...new Set(stepsArray)]
                    }
                }
            );
            migratedCount++;
        }

        return NextResponse.json({
            success: true,
            migratedCount
        });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json(
            { error: 'Migration failed' },
            { status: 500 }
        );
    }
} 