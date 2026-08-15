import mongoose from 'mongoose';
import 'dotenv/config';

const dbConnector = async () => {
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is missing in environment variables');
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 20000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            minPoolSize: 2
        });
        console.log('The Database has been connected!');
    } catch (err) {
        console.error('Database connection error:', err.message);
        throw err;
    }
};

export default dbConnector;