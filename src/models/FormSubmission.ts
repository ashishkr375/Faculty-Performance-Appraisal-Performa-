import { Schema, model, models, Document } from 'mongoose';

interface FormSubmissionDocument extends Document {
    email: string;
    data: Record<string, unknown>;
    submittedAt: Date;
}

const FormSubmissionSchema = new Schema<FormSubmissionDocument>({
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
    model<FormSubmissionDocument>('FormSubmission', FormSubmissionSchema); 