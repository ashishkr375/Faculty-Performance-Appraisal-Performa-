import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { generateAppraisalPDF } from '@/lib/pdf/generateAppraisalPDF';
import { validatePDFData } from '@/lib/validations/pdfValidation';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.role === 'admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { db } = await connectToDatabase();
        const submission = await db.collection('forms').findOne({
            _id: params.id
        });

        if (!submission) {
            return new NextResponse('Submission not found', { status: 404 });
        }

        // Validate the data before generating PDF
        const validation = await validatePDFData(submission);
        if (!validation.isValid) {
            return new NextResponse(
                JSON.stringify({ 
                    error: 'Invalid form data', 
                    validationErrors: validation.errors 
                }),
                { status: 400 }
            );
        }

        const pdfBuffer = await generateAppraisalPDF(submission);

        // Set response headers for PDF download
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="appraisal_${submission.userId}.pdf"`);

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return new NextResponse('Error generating PDF', { status: 500 });
    }
} 