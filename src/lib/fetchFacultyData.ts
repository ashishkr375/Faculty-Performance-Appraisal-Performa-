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
    phd_candidates: Array<{
        id: number;
        email: string;
        student_name: string;
        thesis_topic: string;
        start_year: string;
        completion_year: string;
        roll_no:string;
        registration_year:number;
        current_status:string;
        research_area:string;
        other_supervisors:string;
        registration_type:string;
    }>;
    journal_papers: Array<{
        publication_id: number;
        title: string;
        authors: string;
        journal_name: string;
        publication_year: string;
        volume: string;
        pages: string;
        doi_url: string;
        student_involved:number;
        publication_date:Date;
        journal_quartile:string;
        student_details:string;
    }>;
    conference_papers: Array<{
        publication_id: number;
        title: string;
        authors: string;
        conference_name: string;
        conference_year: string;
        conference_location: string;
        doi_url: string;
        location:string;
        pages:string;
        indexing:string;
        foreign_author:string;
        student_involved:string;
        doi:string;
    }>;
    textbooks: Array<{
        publication_id: number;
        title: string;
        authors: string;
        publisher: string;
        publication_year: string;
        isbn:string;
        scopus:string;
        year:number;
        doi:string;
        pages:string;
    }>;
    edited_books: Array<{
        publication_id: number;
        title: string;
        editors: string;
        publisher: string;
        publication_year: string;
        isbn:string;
        scopus:string;
        year:number;
        doi:string;
        pages:string;
    }>;
    book_chapters: Array<{
        publication_id: number;
        chapter_title: string;
        book_title: string;
        authors: string;
        publisher: string;
        publication_year: string;
        isbn:string;
        scopus:string;
        year:number;
        doi:string;
        pages:string;
        
    }>;
    sponsored_projects: Array<{
        id: string;
        email: string;
        project_title: string;
        funding_agency: string;
        financial_outlay: string;
        start_date: string;
        end_date: string;
        investigators: string;
        pi_institute: string;
        status: string;
        funds_received: string;
      }>;
      consultancy_projects: Array<{
        id: string;
        email: string;
        project_title: string;
        funding_agency: string;
        financial_outlay: string;
        start_date: string;
        period_months: number;
        investigators: string;
        status: string;
      }>;
    ipr: Array<{
        id: string;
        email: string;
        title: string;
        type: string;
        registration_date: string;
        publication_date: string;
        grant_date: string;
        grant_no: string;
        applicant_name: string;
        inventors: string;
      }>;
      startups: Array<{
        id: string;
        email: string;
        startup_name: string;
        incubation_place: string;
        registration_date: string;
        owners_founders: string;
        annual_income: string;
        pan_number: string;
      }>;
    patents: Array<{
        id: number;
        title: string;
        description: string;
        patent_date: string;
        email: string;
      }>;
    teaching_engagement: Array<{
        id: number;
        subject_code: string;
        subject_name: string;
        semester: string;
        academic_year: string;
        teaching_hours_per_week: number;
        student_count: number;
        level:string;
        course_number:string;
        course_title:string;
        course_type:string;
        lectures:number;
        tutorials:number;
        practicals:number;
        total_theory:number;
        lab_hours:number;
        years_offered:string;
    }>;
    project_supervision: Array<{
        id: string;
        email: string;
        category: string;
        project_title: string;
        student_details: string;
        internal_supervisors: string;
        external_supervisors: string;
      }>;
      workshops_conferences: Array<{
        id: string;
        email: string;
        event_type: string;
        role: string;
        event_name: string;
        sponsored_by: string;
        start_date: string;
        end_date: string;
        participants_count: number;
      }>;
    institute_activities: Array<{
        id: string;
        email: string;
        role_position: string;
        start_date: string;
        end_date: string;
      }>;
      department_activities: Array<{
        id: string;
        email: string;
        activity_description: string;
        start_date: string;
        end_date: string;
      }>;
    
    memberships: Array<{
        id: number;
        email: string;
        membership_id: string;
        membership_society: string;
        start: string;
        end: string;
      }>;
      work_experience: Array<{
        id: string;
        email: string;
        work_experiences: string;
        institute: string;
        start_date: string;
        end_date: string;
      }>;
    
    internships: Array<{
        id: string;
        email: string;
        student_name: string;
        qualification: string;
        affiliation: string;
        project_title: string;
        start_date: string;
        end_date: string;
        student_type: string;
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
        
        const response = await fetch(`https://adminportal-updated-new.vercel.app/api/faculty?type=${encodeURIComponent(email)}`, {
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
            phd_candidates: Array.isArray(rawData.phd_candidates) ? rawData.phd_candidates : [],
            journal_papers: Array.isArray(rawData.journal_papers) ? rawData.journal_papers : [],
            conference_papers: Array.isArray(rawData.conference_papers) ? rawData.conference_papers : [],
            textbooks: Array.isArray(rawData.textbooks) ? rawData.textbooks : [],
            edited_books: Array.isArray(rawData.edited_books) ? rawData.edited_books : [],
            book_chapters: Array.isArray(rawData.book_chapters) ? rawData.book_chapters : [],
            sponsored_projects: Array.isArray(rawData.sponsored_projects) ? rawData.sponsored_projects : [],
            consultancy_projects: Array.isArray(rawData.consultancy_projects) ? rawData.consultancy_projects : [],
            ipr: Array.isArray(rawData.ipr) ? rawData.ipr : [],
            startups: Array.isArray(rawData.startups) ? rawData.startups : [],
            patents: Array.isArray(rawData.patents) ? rawData.patents : [],
            teaching_engagement: Array.isArray(rawData.teaching_engagement) ? rawData.teaching_engagement : [],
            project_supervision: Array.isArray(rawData.project_supervision) ? rawData.project_supervision : [],
            workshops_conferences: Array.isArray(rawData.workshops_conferences) ? rawData.workshops_conferences : [],
            institute_activities: Array.isArray(rawData.institute_activities) ? rawData.institute_activities : [],
            department_activities: Array.isArray(rawData.department_activities) ? rawData.department_activities : [],
            memberships: Array.isArray(rawData.memberships) ? rawData.memberships : [],
            work_experience: Array.isArray(rawData.work_experience) ? rawData.work_experience : [],
            internships: Array.isArray(rawData.internships) ? rawData.internships : []
        };

    } catch (error) {
        console.error('Error fetching faculty data:', error);
        throw error;
    }
} 