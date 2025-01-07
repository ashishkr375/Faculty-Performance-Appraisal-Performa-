import { Schema, model, models } from 'mongoose';

const formSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    academicYear: {
        type: String,
        required: true
    },
    isSubmitted: {
        type: Boolean,
        default: false
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    completedSteps: [{
        type: Number
    }],
    totalMarks: {
        type: Number,
        default: 0
    },
    step1: {
        name: String,
        email: String,
        department: String,
        designation: String,
        jointFaculty: String,
        jointFacultyDepartment: String,
        appraisalPeriodStart: String,
        appraisalPeriodEnd: String
    },
    step2: {
        type: Object
    },
    step3: {
        type: Object
    },
    step4: {
        type: Object
    },
    step5: {
        type: Object
    },
    step6: {
        type: Object
    },
    step7: {
        type: Object
    }
}, {
    timestamps: true
});

export const Form = models.Form || model('Form', formSchema); 