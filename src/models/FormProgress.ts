import { Schema, model, models, Document } from 'mongoose';

interface IFormProgress extends Document {
    email: string;
    step1: Record<string, any> | null;
    step2: Record<string, any> | null;
    currentStep: number;
    lastUpdated: Date;
}

const FormProgressSchema = new Schema<IFormProgress>({
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
    model<IFormProgress>('FormProgress', FormProgressSchema); 