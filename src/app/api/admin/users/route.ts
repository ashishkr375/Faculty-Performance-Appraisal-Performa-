import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    try {
        const { db } = await connectToDatabase();
        
        // Get all form submissions
        const forms = await db.collection('forms')
            .find({})
            .project({
                userId: 1,
                'step1.name': 1,
                'step1.department': 1,
                completedSteps: 1,
                lastUpdated: 1
            })
            .toArray();

        // Get all admins
        const admins = await db.collection('admins')
            .find({})
            .project({ email: 1 })
            .toArray();

        // Combine the data
        const users = forms.map(form => ({
            ...form,
            isAdmin: admins.some(admin => admin.email === form.userId)
        }));

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
} 