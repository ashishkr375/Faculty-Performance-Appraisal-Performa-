import type { FormData } from '@/types/form';

interface BaseFormData {
    courses: Array<{
        totalTheoryHours: number;
        totalLabHours: number;
    }>;
    innovations: string[];
    newLabs: string[];
    otherTasks: string[];
    projectSupervision: {
        btech: Array<Record<string, unknown>>;
        mtech: Array<Record<string, unknown>>;
    };
}

export function calculateStep2Marks(formData: any): number {
    let marks = 0;
    
    // Check for nested structure and handle courses
    const courses = formData?.step2?.courses || formData?.courses || [];
    courses.forEach((course: any) => {
        marks += (course.totalTheoryHours * 1) + (course.totalLabHours * 0.5);
    });
    marks = Math.min(marks, 14);

    // Handle innovations
    const innovations = formData?.step2?.innovations || formData?.innovations || [];
    marks += Math.min(innovations.length, 2);

    // Handle new labs
    const newLabs = formData?.step2?.newLabs || formData?.newLabs || [];
    marks += newLabs.length * 2;

    // Handle other tasks
    const otherTasks = formData?.step2?.otherTasks || formData?.otherTasks || [];
    marks += Math.min(otherTasks.length, 2);

    // Handle project supervision
    const btechProjects = formData?.step2?.projectSupervision?.btech || formData?.projectSupervision?.btech || [];
    const mtechProjects = formData?.step2?.projectSupervision?.mtech || formData?.projectSupervision?.mtech || [];
    
    marks += btechProjects.length * 2; // 2 marks per B.Tech project
    marks += mtechProjects.length * 3; // 3 marks per M.Tech project

    // Cap total marks at maximum allowed (if needed)
    // marks = Math.min(marks, MAX_MARKS); // Uncomment and set MAX_MARKS if needed

    return marks;
}

export const calculateStep3Marks = (formData: any) => {
    let marks = 0;

    // PhD Supervision (max 10 marks)
    formData.phdSupervision.forEach((student: any) => {
        const regYear = new Date(student.registrationYear).getFullYear();
        const currentYear = new Date().getFullYear();
        const yearsRegistered = currentYear - regYear;

        if (student.currentStatus === 'Awarded') {
            marks += 4;
        } else if (yearsRegistered <= 3) {
            marks += 2;
        } else if (yearsRegistered <= 5) {
            marks += 1;
        }
    });

    // Journal Papers
    formData.journalPapers.forEach((paper: any) => {
        switch (paper.quartile) {
            case 'Q1': marks += 4; break;
            case 'Q2': marks += 3; break;
            case 'Q3': marks += 2; break;
            case 'Q4': marks += 1; break;
        }
    });

    // Conference Papers (max 5 marks)
    let confMarks = 0;
    formData.conferencePapers.forEach((paper: any) => {
        if (paper.indexed === 'SCOPUS' || paper.indexed === 'WOS') {
            confMarks += 0.5;
        } else {
            confMarks += 0.25;
        }
    });
    marks += Math.min(confMarks, 5);

    return Math.min(marks, 40);
};

export const calculateStep4Marks = (formData: any) => {
    let marks = 0;

    // Sponsored Projects
    formData.sponsoredProjects.forEach((project: any) => {
        const amount = project.financialOutlay;
        if (amount >= 1000000) { // ≥ 10 lacs
            marks += 5;
        } else if (amount >= 500000) { // 5-10 lacs
            marks += 4;
        } else { // ≤ 5 lacs
            marks += 3;
        }
    });

    // Consultancy Projects (max 8 marks)
    let consultancyMarks = 0;
    formData.consultancyProjects.forEach((project: any) => {
        const amount = project.financialOutlay;
        consultancyMarks += Math.floor(amount / 50000);
    });
    marks += Math.min(consultancyMarks, 8);

    // IPR
    formData.ipr.forEach((item: any) => {
        if (item.type === 'Patent') {
            if (item.grantDate) marks += 3;
            if (item.publicationDate) marks += 2;
        } else if (item.grantDate) {
            marks += 1;
        }
    });

    return Math.min(marks, 14);
};

export const calculateStep5Marks = (formData: any) => {
    let marks = 0;

    // Events
    formData.events.forEach((event: any) => {
        if (event.type === 'International') {
            marks += 3;
        } else {
            marks += 1;
        }
    });

    // Lectures (max 1 mark)
    marks += Math.min(formData.lectures.length * 0.5, 1);

    // Online Courses
    formData.onlineCourses.forEach((course: any) => {
        marks += course.completed ? 1 : 0.5;
    });

    // Visits (max 1 mark)
    marks += Math.min(formData.visits.length * 0.5, 1);

    // Outreach Activities (max 7 marks)
    marks += Math.min(formData.outreachActivities.length, 7);

    return Math.min(marks, 6);
};

export const calculateStep6Marks = (formData: any) => {
    let marks = 0;

    // Institute Level (max 10 marks)
    formData.instituteLevelActivities.forEach((activity: any) => {
        marks += activity.marks;
    });

    // Department Level (max 5 marks)
    formData.departmentLevelActivities.forEach((activity: any) => {
        marks += activity.marks;
    });

    return Math.min(marks, 15);
};

// Combined object for Preview component
export const calculateMarks = {
    instructionalElement: calculateStep2Marks,
    researchPublications: calculateStep3Marks,
    sponsoredRD: calculateStep4Marks,
    organizationParticipation: calculateStep5Marks,
    managementDevelopment: calculateStep6Marks
}; 