import { z } from 'zod';

// Personal Information Schema (Step 1)
export const personalInfoSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
    jointFaculty: z.string().optional(),
    jointFacultyDepartment: z.string().optional(),
    appraisalPeriodStart: z.string().min(1, 'Appraisal period start is required'),
    appraisalPeriodEnd: z.string().min(1, 'Appraisal period end is required')
}).strict();

// Teaching Load Schema (Step 2)
export const courseSchema = z.object({
    code: z.string().min(1, 'Course code is required'),
    name: z.string().min(1, 'Course name is required'),
    semester: z.string().min(1, 'Semester is required'),
    type: z.string().min(1, 'Course type is required'),
    level: z.string().min(1, 'Course level is required'),
    studentsCount: z.number().min(0, 'Invalid student count'),
    contactHours: z.number().min(0, 'Invalid contact hours')
});

export const teachingLoadSchema = z.object({
    courses: z.array(courseSchema).min(1, 'At least one course is required')
});

// Sponsored R&D Schema (Step 4)
export const sponsoredProjectSchema = z.object({
    title: z.string().min(1, 'Project title is required'),
    fundingAgency: z.string().min(1, 'Funding agency is required'),
    financialOutlay: z.number().min(0, 'Invalid financial outlay'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    investigators: z.string().min(1, 'Investigators are required'),
    piInstitute: z.string().min(1, 'PI Institute is required'),
    status: z.enum(['Started', 'In Progress', 'Completed']),
    fundReceived: z.number().min(0, 'Invalid fund received')
});

export const consultancyProjectSchema = z.object({
    title: z.string().min(1, 'Project title is required'),
    fundingAgency: z.string().min(1, 'Funding agency is required'),
    financialOutlay: z.number().min(0, 'Invalid financial outlay'),
    startDate: z.string().min(1, 'Start date is required'),
    period: z.string().min(1, 'Period is required'),
    investigators: z.string().min(1, 'Investigators are required'),
    status: z.enum(['Started', 'In Progress', 'Completed'])
});

export const iprSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['Patent', 'Design', 'Copyright']),
    registrationDate: z.string().min(1, 'Registration date is required'),
    publicationDate: z.string().optional(),
    grantDate: z.string().optional(),
    grantNumber: z.string().optional(),
    applicant: z.string().min(1, 'Applicant is required'),
    inventors: z.string().min(1, 'Inventors are required')
});

export const sponsoredRDSchema = z.object({
    sponsoredProjects: z.array(sponsoredProjectSchema),
    consultancyProjects: z.array(consultancyProjectSchema),
    ipr: z.array(iprSchema),
    startups: z.array(z.object({
        name: z.string().min(1, 'Startup name is required'),
        incubationPlace: z.string().min(1, 'Incubation place is required'),
        registrationDate: z.string().min(1, 'Registration date is required'),
        owners: z.string().min(1, 'Owners are required'),
        annualIncome: z.number().min(0, 'Invalid annual income'),
        panNumber: z.string().min(1, 'PAN number is required')
    })),
    industryLabs: z.array(z.object({
        industryName: z.string().min(1, 'Industry name is required'),
        fundReceived: z.number().min(0, 'Invalid fund received'),
        equipmentName: z.string().min(1, 'Equipment name is required'),
        location: z.string().min(1, 'Location is required')
    }))
});

// Organization & Participation Schema (Step 5)
export const organizationParticipationSchema = z.object({
    events: z.array(z.object({
        type: z.enum(['National', 'International']),
        role: z.string().min(1, 'Role is required'),
        name: z.string().min(1, 'Event name is required'),
        sponsor: z.string().min(1, 'Sponsor is required'),
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().min(1, 'End date is required'),
        participants: z.number().min(0, 'Invalid participants count')
    })),
    lectures: z.array(z.object({
        title: z.string().min(1, 'Title is required'),
        details: z.string().min(1, 'Details are required')
    })),
    onlineCourses: z.array(z.object({
        type: z.string().min(1, 'Course type is required'),
        title: z.string().min(1, 'Title is required'),
        ltp: z.string().min(1, 'L-T-P is required'),
        level: z.string().min(1, 'Level is required'),
        duration: z.number().min(0, 'Invalid duration'),
        completed: z.boolean()
    })),
    visits: z.array(z.object({
        institution: z.string().min(1, 'Institution is required'),
        purpose: z.string().min(1, 'Purpose is required'),
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().min(1, 'End date is required'),
        funding: z.string().min(1, 'Funding details are required')
    })),
    outreachActivities: z.array(z.string().min(1, 'Activity description is required'))
});

// Management & Development Schema (Step 6)
export const managementDevelopmentSchema = z.object({
    instituteLevelActivities: z.array(z.object({
        role: z.string().min(1, 'Role is required'),
        duration: z.string().min(1, 'Duration is required'),
        marks: z.number().min(0, 'Invalid marks')
    })),
    departmentLevelActivities: z.array(z.object({
        activity: z.string().min(1, 'Activity is required'),
        duration: z.string().min(1, 'Duration is required'),
        marks: z.number().min(0, 'Invalid marks')
    }))
});

// Self Appraisal Schema (Step 7)
export const selfAppraisalSchema = z.object({
    achievements: z.string().min(1, 'Achievements are required'),
    areasOfImprovement: z.string().min(1, 'Areas of improvement are required'),
    futurePlans: z.string().min(1, 'Future plans are required'),
    supportRequired: z.string().min(1, 'Support required details are required'),
    additionalComments: z.string().optional()
}); 