import { NextRequest, NextResponse } from 'next/server';

interface FacultyResponse {
  profile: {
    name: string;
    email: string;
    designation: string | null;
    department: string;
  };
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Fetch faculty data from NITP API
        const response = await fetch(`https://admin.nitp.ac.in/api/faculty?type=${encodeURIComponent(email)}`);
        
        if (!response.ok) {
            return NextResponse.json({ 
                name: '',
                email: email,
                designation: ''
            });
        }

        const data: FacultyResponse = await response.json();
        
        // Extract and format the required fields
        return NextResponse.json({
            name: data.profile.name || '',
            email: data.profile.email,
            // If designation is null, use department instead
            designation: data.profile.designation || data.profile.department || ''
        });

    } catch (error) {
        console.error('Error fetching faculty data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch faculty data' },
            { status: 500 }
        );
    }
}
