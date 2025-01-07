import { Schema, model, models, Document } from 'mongoose';

interface IFormSubmission extends Document {
    email: string;
    data: Record<string, any>;
    submittedAt: Date;
}

const FormSubmissionSchema = new Schema<IFormSubmission>({
    email: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

export const FormSubmission = models.FormSubmission || 
    model<IFormSubmission>('FormSubmission', FormSubmissionSchema); 