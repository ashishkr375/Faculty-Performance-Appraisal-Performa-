// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mongoose from 'mongoose';

declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
} 