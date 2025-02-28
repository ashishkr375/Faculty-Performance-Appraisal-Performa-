import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
    try {
        const { email } = await req.json();
        if (!email || typeof email !== 'string') {
            return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
        }
        const { db } = await connectToDatabase();
        const result = await db.collection('forms').updateOne(
            { userId:email },
            { $set: { finalSubmit: true } },
            { upsert: false }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Email not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Form submitted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error submitting form:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
