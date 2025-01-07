import { Schema, model, models, Document } from 'mongoose';

interface FormProgressDocument extends Document {
    email: string;
    step1: Record<string, unknown>;
    step2: Record<string, unknown>;
    currentStep: number;
    lastUpdated: Date;
}

const FormProgressSchema = new Schema<FormProgressDocument>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    step1: {
        type: Schema.Types.Mixed,
        default: null
    },
    step2: {
        type: Schema.Types.Mixed,
        default: null
    },
    currentStep: {
        type: Number,
        default: 1
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export const FormProgress = models.FormProgress || 
    model<FormProgressDocument>('FormProgress', FormProgressSchema); 