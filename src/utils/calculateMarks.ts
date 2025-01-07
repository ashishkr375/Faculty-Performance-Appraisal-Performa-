import { SponsoredRD } from '@/types/form';

// Individual step calculation functions
export const calculateStep2Marks = (formData: any) => {
    let marks = 0;
    
    // Teaching Engagement (max 14 marks)
    formData.courses.forEach((course: any) => {
        marks += (course.totalTheoryHours * 1) + (course.totalLabHours * 0.5);
    });
    marks = Math.min(marks, 14);

    // Innovations (max 2 marks)
    marks += Math.min(formData.innovations.length * 1, 2);

    // New Labs (max 5 marks)
    formData.newLabs.forEach(() => {
        marks += 2;
    });

    // Other Tasks (max 2 marks)
    marks += Math.min(formData.otherTasks.length * 1, 2);

    // Project Supervision (max 10 marks)
    formData.projectSupervision.btech.forEach(() => {
        marks += 2;
    });
    formData.projectSupervision.mtech.forEach(() => {
        marks += 3;
    });

    return Math.min(marks, 25);
};

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