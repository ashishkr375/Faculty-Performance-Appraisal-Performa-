import { z } from 'zod';

export const pdfValidationSchema = z.object({
    personalInfo: z.object({
        name: z.string().min(1, 'Name is required'),
        designation: z.string().min(1, 'Designation is required'),
        department: z.string().min(1, 'Department is required'),
        jointFaculty: z.string().optional()
    }),
    teachingLoad: z.object({
        courses: z.array(z.object({
            code: z.string().min(1, 'Course code is required'),
            type: z.string().min(1, 'Course type is required'),
            studentsCount: z.number().min(0, 'Invalid student count'),
            weeklyLoad: z.string().min(1, 'Weekly load is required'),
            totalHours: z.number().min(0, 'Invalid total hours'),
            offeringYears: z.number().min(0, 'Invalid offering years')
        })).min(1, 'At least one course is required'),
        innovations: z.string().optional(),
        newLaboratory: z.string().optional()
    }),
    marks: z.object({
        instructional: z.number().min(0).max(25, 'Maximum 25 marks allowed'),
        research: z.number().min(0).max(40, 'Maximum 40 marks allowed'),
        sponsored: z.number().min(0).max(14, 'Maximum 14 marks allowed'),
        organization: z.number().min(0).max(6, 'Maximum 6 marks allowed'),
        management: z.number().min(0).max(15, 'Maximum 15 marks allowed'),
        total: z.number().max(100, 'Maximum 100 marks allowed')
    })
    // Add more validation rules for other sections
});

export async function validatePDFData(data: any) {
    try {
        await pdfValidationSchema.parseAsync(data);
        return { isValid: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.reduce((acc: Record<string, string>, curr) => {
                const path = curr.path.join('.');
                acc[path] = curr.message;
                return acc;
            }, {});
            return { isValid: false, errors };
        }
        throw error;
    }
} 