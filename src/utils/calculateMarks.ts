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
export function calculateStep2ShowMarks(formData: any): number {
    let marks = 0;

    const courses = formData?.teachingEngagement?.courses || formData?.courses || [];
    courses.forEach((course: any) => {
        marks += (course.totalTheoryHours * 1) + (course.totalLabHours * 0.5);
    });
    marks = Math.min(marks, 14);
    const innovations = formData?.step2?.innovations || formData?.innovations || [];
    marks += Math.min(innovations.length, 2);
    const newLabs = formData?.step2?.newLabs || formData?.newLabs || [];
    marks += newLabs.length * 2;
    const experimentLabs=formData?.step2?.ExperimentLabs || formData?.ExperimentLabs || [];
    marks+=experimentLabs.length;
    const otherTasks = formData?.step2?.otherTasks || formData?.otherTasks || [];
    marks += Math.min(otherTasks.length, 2);
    const btechProjects = formData?.step2?.projectSupervision?.btech || formData?.projectSupervision?.btech || [];
    const mtechProjects = formData?.step2?.projectSupervision?.mtech || formData?.projectSupervision?.mtech ||  formData?.projectSupervision?.mca ||  formData?.projectSupervision?.mba|| [];
    let temp_marks=btechProjects.length *2;
    temp_marks+=mtechProjects.length*3;
    temp_marks=Math.min(temp_marks,10);
    marks+=temp_marks;

    marks = Math.min(marks, 25);
    return marks;
}

export function calculateStep2Marks(formData: any): number {
    let marks = 0;
    
    // Check for nested structure and handle courses
    const courses = formData?.step2?.teachingEngagement?.courses || formData?.courses || [];
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

    const experimentLabs=formData?.step2?.ExperimentLabs || formData?.ExperimentLabs || [];
    marks+=experimentLabs.length;

    // Handle other tasks
    const otherTasks = formData?.step2?.otherTasks || formData?.otherTasks || [];
    marks += Math.min(otherTasks.length, 2);

    // Handle project supervision
    const btechProjects = formData?.step2?.projectSupervision?.btech || formData?.projectSupervision?.btech || [];
    const mtechProjects = formData?.step2?.projectSupervision?.mtech || formData?.projectSupervision?.mtech ||  formData?.projectSupervision?.mca ||  formData?.projectSupervision?.mba|| [];
    
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

    formData.sponsoredProjects.forEach((project: any) => {
        let projectMarks = 1;
        const amount = project.financialOutlay;
        if(project.status==="Submitted"){
            projectMarks=1;
        }
        else if (amount >= 1000000) {
            projectMarks = 5;
        } else if (amount >= 500000) {
            projectMarks = 4;
        } else if (amount >= 50000) {
            projectMarks = 3;
        }

        marks += projectMarks;
    });

    let temp_marks = 0;
    formData.industryLabs.forEach((lab: any) => {
        temp_marks += 1;
    });
    marks += Math.min(temp_marks, 5);

    let internshipMarks = 0;
    formData.internships.forEach((internship: any) => {
        internshipMarks = Math.min(internshipMarks + (internship.isExternal ? 2 : 1), 4);
    });
    marks += internshipMarks;

    let startupMarks = 0;
    formData.startups.forEach((startup: any) => {
        let startupBaseMarks = 2;
        const amount = startup.financialOutlay;

        if (amount >= 1000000) {
            startupBaseMarks += 6;
        } else if (amount >= 500000) {
            startupBaseMarks += 5;
        } else if (amount >= 100000) {
            startupBaseMarks += 4;
        } else if (amount >= 50000) {
            startupBaseMarks += 3;
        }

        startupMarks += startupBaseMarks;
    });
    marks += Math.min(startupMarks, 6);

    formData.ipr.forEach((item: any) => {
        let iprMarks = 1;
        if (item.type === 'Patent') {
            iprMarks += item.grantDate ? 3 : 2;
        } else if (item.type === 'Technology Transfer') {
            iprMarks = 4;
        } else if (item.grantDate) {//published  --mpsir patent
            iprMarks += 1;
        }
        marks += iprMarks;
    });

    let consultancyMarks = 0;
    formData.consultancyProjects.forEach((project: any) => {
        const amount = project.financialOutlay;
        let consultancyProjectMarks = 1;

        if (amount >= 50000) {
            consultancyProjectMarks = Math.floor(amount / 50000);
        }

        consultancyMarks += consultancyProjectMarks;
    });
    marks += Math.min(consultancyMarks, 8);

    return Math.min(marks, 14);
};



export const calculateStep5Marks = (formData: any) => {
    let marks = 0;
    let temp_marks=0
    // Events
    formData.events.forEach((event: any) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        const durationInMs = endDate.getTime() - startDate.getTime();
        const durationInDays = durationInMs / (1000 * 3600 * 24);
        if (event.type && (event.type.toLowerCase() === 'national' || event.type.toLowerCase() === 'international')) {
            temp_marks += 3;
            return;
        } 
        if (durationInDays === 5) {
            if (event.role && (event.role.toLowerCase() === 'coordinator' || event.role.toLowerCase() === 'convener')) {
                temp_marks += 2;
            }
        } else if (durationInDays === 7) {
            temp_marks += 1;
        } else if (durationInDays === 14) {
            temp_marks += 2;
        }else{
            temp_marks+=1;
        }
    });
    
    marks+=Math.min(temp_marks,3)

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

export const calculateStep6Marks = (formData: any,appraisalYear:number) => {
    let marks = 0;

    // const getNumberOfSemesters = (duration: string) => {
    //     const [startDate, endDate] = duration.split(" - ");
    //     const start = new Date(startDate);
    //     const currentYear = new Date().getFullYear();
        
    //     // if (start.getFullYear() < currentYear) {
    //     //     start.setFullYear(currentYear, 0, 1);
    //     // }

    //     const end = endDate === 'Continue' ? new Date() : new Date(endDate);

    //     let semesters = 0;

    //     const isValidSemester = (start: Date, end: Date) => {
    //         const monthsDifference = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
    //         return monthsDifference >= 4;
    //     };

    //     const baseEndDate = new Date(currentYear, 5, 30);

    //     if (start.getFullYear() === end.getFullYear()) {
    //         if (start <= baseEndDate && end >= baseEndDate) {
    //             if (isValidSemester(start, baseEndDate) && isValidSemester(baseEndDate, end)) {
    //                 semesters = 2;
    //             } else if (isValidSemester(start, baseEndDate)) {
    //                 semesters = 1;
    //             } else if (isValidSemester(baseEndDate, end)) {
    //                 semesters = 1;
    //             }
    //         } else {
    //             if (isValidSemester(start, end)) {
    //                 semesters = 1;
    //             }
    //         }
    //     } else {
    //         const firstSemesterEnd = new Date(currentYear, 5, 30);
    //         if (isValidSemester(start, firstSemesterEnd)) {
    //             semesters++;
    //         }

    //         const secondSemesterStart = new Date(currentYear, 6, 1);
    //         if (isValidSemester(secondSemesterStart, end)) {
    //             semesters++;
    //         }
    //     }
    //     // return Math.min(semesters, 2);
    //     return (semesters);
    // };

    const getNumberOfSemesters = (duration: string) => {
        const [startDate, endDate] = duration.split(" - ");
        const start = new Date(startDate);
        const startingAppraisalYear=new Date(Math.max(start,new Date(appraisalYear,0,1)));
        const end = endDate === 'Continue' ? new Date() : new Date(endDate);
    
        let semesters = 0;
        const monthDifference = (end.getFullYear() - startingAppraisalYear.getFullYear()) * 12 + (end.getMonth() - startingAppraisalYear.getMonth());

        semesters = Math.floor(monthDifference / 6);
        return Math.min(semesters, 2);
    };

    formData.instituteLevelActivities.forEach((activity: any) => {
        const semesters = getNumberOfSemesters(activity.duration);
        if (semesters > 0) {
            marks += activity.marks * semesters;
        }
    });

    formData.departmentLevelActivities.forEach((activity: any) => {
        const semesters = getNumberOfSemesters(activity.duration);
        if (semesters > 0) {
            marks += activity.marks * semesters;
        }
    });

    return marks>0.5 ? Math.min(marks+0.5, 15):0; 
};


// Combined object for Preview component
export const calculateMarks = {
    instructionalElement: calculateStep2Marks,
    researchPublications: calculateStep3Marks,
    sponsoredRD: calculateStep4Marks,
    organizationParticipation: calculateStep5Marks,
    managementDevelopment: calculateStep6Marks
}; 