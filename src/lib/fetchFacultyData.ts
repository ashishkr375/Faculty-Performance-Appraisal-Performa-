export interface FacultyProfile {
    profile: {
        id?: number;
        name: string;
        email: string;
        department: string;
        designation: string;
        research_interest: string;
        role?: number;
    };
    subjects_teaching: Array<{
        id: number;
        email: string;
        code: string;
        name: string;
        start: string;
        end: string;
    }>;
    phd_candidates: Array<{
        id: number;
        email: string;
        phd_student_name: string;
        thesis_topic: string;
        start_year: string;
        completion_year: string;
    }>;
    publications: Array<{
        publication_id: number;
        publications: string;
    }>;
    curr_admin_responsibility: Array<{
        id: number;
        email: string;
        curr_responsibility: string;
        start: string;
    }>;
    past_admin_responsibility: Array<{
        id: number;
        email: string;
        past_responsibility: string;
        start: string;
        end: string;
    }>;
}

export class UnauthorizedError extends Error {
    constructor(message: string = 'Unauthorized access') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class StudentEmailError extends Error {
    constructor(message: string = 'Student email detected') {
        super(message);
        this.name = 'StudentEmailError';
    }
}

export async function fetchFacultyData(email: string): Promise<FacultyProfile | null> {
    if (!email) return null;
    
    try {
        console.log('Fetching data for email:', email);
        
        const response = await fetch(`https://admin.nitp.ac.in/api/faculty/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });
        
        if (response.status === 401 || response.status === 403) {
            throw new UnauthorizedError();
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch faculty data: ${response.status}`);
        }

        const rawData = await response.json();
        console.log('Raw API response:', rawData);
        
        // Check if we have a valid profile object
        if (!rawData?.profile?.name) {
            throw new Error('No profile found for this email. Please contact the administrator.');
        }

        // Check if it's a student email and not a developer (role !== 1)
        const isStudentEmail = email.match(/\.(dd|mt|phd|btech)\d{2}\./i) !== null;
        const isDeveloper = rawData.profile.role === 1;

        if (isStudentEmail && !isDeveloper) {
            throw new StudentEmailError('This form is only for faculty members. Students cannot access this form.');
        }

        // Extract profile data with fallbacks
        const profile = {
            id: rawData.profile.id,
            name: rawData.profile.name,
            email: rawData.profile.email,
            department: rawData.profile.department,
            designation: rawData.profile.designation,
            research_interest: rawData.profile.research_interest || '',
            role: rawData.profile.role
        };

        console.log('Processed profile:', profile);

        return {
            profile,
            subjects_teaching: Array.isArray(rawData.subjects_teaching) ? rawData.subjects_teaching : [],
            phd_candidates: Array.isArray(rawData.phd_candidates) ? rawData.phd_candidates : [],
            publications: Array.isArray(rawData.publications) ? rawData.publications : [],
            curr_admin_responsibility: Array.isArray(rawData.curr_admin_responsibility) ? rawData.curr_admin_responsibility : [],
            past_admin_responsibility: Array.isArray(rawData.past_admin_responsibility) ? rawData.past_admin_responsibility : []
        };

    } catch (error) {
        console.error('Error fetching faculty data:', error);
        throw error;
    }
} 