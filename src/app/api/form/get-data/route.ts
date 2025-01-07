import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401 
            });
        }

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        const { db } = await connectToDatabase();
        const formData = await db.collection('forms').findOne(
            { 
                userId: email,
                academicYear: '2023-24'
            },
            { projection: { _id: 0 } }
        );

        if (!formData) {
            return new Response(JSON.stringify({ error: 'No data found' }), { 
                status: 404 
            });
        }

        return new Response(JSON.stringify(formData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
            status: 500 
        });
    }
} 