import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { generateDocxFromTemplate } from '@/lib/docx/generateDocument';

export async function GET(
    request: NextRequest,
    context: { params: { email: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Safely get email parameter
        const { email } = await context.params;
        const userEmail = decodeURIComponent(email);

        const { db } = await connectToDatabase();
        const formData = await db.collection('forms').aggregate([
            {
                $match: { 
                    userId: userEmail,
                    academicYear: '2023-24'
                }
            },
            {
                $lookup: {
                    from: 'teaching_load',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'teachingLoad'
                }
            },
            {
                $lookup: {
                    from: 'research_papers',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'researchPapers'
                }
            },
            // Add more lookups for other sections
            {
                $project: {
                    _id: 0,
                    personalInfo: 1,
                    teachingLoad: { $arrayElemAt: ['$teachingLoad', 0] },
                    researchPapers: { $arrayElemAt: ['$researchPapers', 0] },
                    // Include other fields
                }
            }
        ]).toArray();

        if (!formData) {
            return new Response(
                JSON.stringify({ error: 'Form data not found' }), 
                { status: 404 }
            );
        }

        const docxBuffer = await generateDocxFromTemplate(formData[0]);

        return new Response(docxBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': 'attachment; filename="faculty-appraisal.docx"'
            }
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate document' }), 
            { status: 500 }
        );
    }
} 