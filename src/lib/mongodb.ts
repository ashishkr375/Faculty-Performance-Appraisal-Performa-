import mongoose from 'mongoose';

if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
let cachedDb: mongoose.Connection | null = null;

export async function connectToDatabase() {
    if (cachedDb) {
        console.log('Using cached database connection');
        return { db: cachedDb };
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri!, { dbName });

        cachedDb = mongoose.connection;
        cachedDb.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });
        cachedDb.once('open', () => {
            console.log('MongoDB connected successfully');
        });

        return { db: cachedDb };
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}