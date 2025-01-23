// Basic Information (Step 1)
export interface BasicInfo {
    name: string;
    designation: string;
    department: string;
    jointFaculty: string;
    appraisalPeriodStart: string;
    appraisalPeriodEnd: string;
}

// Teaching Engagement (Step 2)
export interface TeachingCourse {
    semester: string;
    level?: string;
    courseNo: string;
    title: string;
    type?: string;
    studentCount: number;
    weeklyLoadL?: number;
    weeklyLoadT?: number;
    weeklyLoadP?: number;
    totalTheoryHours?: number;
    totalLabHours?: number;
    yearsOffered?: number | string;
    academicYear?: string;
    teachingHoursPerWeek?: number;
}

export interface ProjectSupervision {
    btech: Array<{
        title: string;
        students: string;
        internalSupervisors: string;
        externalSupervisors: string;
    }>;
    mtech: Array<{
        title: string;
        students: string;
        internalSupervisors: string;
        externalSupervisors: string;
    }>;
}

export interface InstructionalElement {
    courses: TeachingCourse[];
    innovations: string[];
    newLabs: string[];
    otherTasks: string[];
    projectSupervision: ProjectSupervision;
    calculatedMarks: number;
}

// Research & Publications (Step 3)
export interface ResearchPublications {
    phdSupervision: {
        studentName: string;
        rollNo: string;
        registrationYear: string;
        status: 'FT' | 'PT';
        stipendType: string;
        researchArea: string;
        otherSupervisors: string;
        sciPublications: number;
        scopusPublications: number;
        currentStatus: string;
        statusDate: string;
    }[];
    journalPapers: {
        authors: string;
        title: string;
        journal: string;
        volume: string;
        year: string;
        pages: string;
        quartile: 'Q1' | 'Q2' | 'Q3' | 'Q4';
        publicationDate: string;
        studentInvolved: string;
        doi: string;
    }[];
    conferencePapers: {
        authors: string;
        title: string;
        conference: string;
        location: string;
        year: string;
        pages: string;
        indexing: 'SCOPUS' | 'Web of Science' | 'Non-indexed';
        foreignAuthor: string;
        studentInvolved: string;
        doi: string;
    }[];
    books: {
        textbooks: {
            title: string;
            authors: string;
            publisher: string;
            isbn: string;
            year: string;
            scopusIndexed: boolean;
            doi: string;
        }[];
        editedBooks: {
            title: string;
            editors: string;
            publisher: string;
            isbn: string;
            year: string;
            scopusIndexed: boolean;
            doi: string;
        }[];
        chapters: {
            authors: string;
            chapterTitle: string;
            bookTitle: string;
            pages: string;
            publisher: string;
            isbn: string;
            year: string;
            scopusIndexed: boolean;
            doi: string;
        }[];
    };
    calculatedMarks: number;
}

// Sponsored R&D (Step 4)
export interface SponsoredRD {
    sponsoredProjects: {
        title: string;
        fundingAgency: string;
        financialOutlay: number;
        startDate: string;
        endDate: string;
        investigators: string;
        piInstitute: string;
        status: 'Started' | 'Completed' | 'In Progress';
        fundReceived: number;
    }[];
    consultancyProjects: {
        title: string;
        fundingAgency: string;
        financialOutlay: number;
        startDate: string;
        period: string;
        investigators: string;
        status: 'Started' | 'Completed' | 'In Progress';
    }[];
    ipr: {
        title: string;
        registrationDate: string;
        publicationDate: string;
        grantDate: string;
        grantNumber: string;
        applicant: string;
        inventors: string;
        type: 'Patent' | 'Design' | 'Copyright';
    }[];
    startups: {
        name: string;
        incubationPlace: string;
        registrationDate: string;
        owners: string;
        annualIncome: number;
        panNumber: string;
    }[];
    internships: {
        studentName: string;
        qualification: string;
        affiliation: string;
        projectTitle: string;
        startDate: string;
        endDate: string;
        isExternal: boolean;
    }[];
    industryLabs: {
        industryName: string;
        fundReceived: number;
        equipmentName: string;
        location: string;
    }[];
    calculatedMarks: number;
}

// Organization & Participation (Step 5)
export interface OrganizationParticipation {
    events: {
        type: 'National' | 'International';
        role: string;
        name: string;
        sponsor: string;
        startDate: string;
        endDate: string;
        participants: number;
    }[];
    lectures: {
        title: string;
        details: string;
    }[];
    onlineCourses: {
        type: string;
        title: string;
        ltp: string;
        level: string;
        duration: number;
        completed: boolean;
    }[];
    visits: {
        institution: string;
        purpose: string;
        startDate: string;
        endDate: string;
        funding: string;
    }[];
    outreachActivities: string[];
    calculatedMarks: number;
}

// Management & Development (Step 6)
export interface ManagementDevelopment {
    instituteLevelActivities: {
        role: string;
        duration: string;
        marks: number;
    }[];
    departmentLevelActivities: {
        activity: string;
        duration: string;
        marks: number;
    }[];
    calculatedMarks: number;
}

// Self Appraisal (Step 7)
export interface SelfAppraisal {
    achievements?: string;
    areasOfImprovement?: string;
    futurePlans?: string;
    supportRequired?: string;
    additionalComments?: string;
} 