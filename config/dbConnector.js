import mongoose from "mongoose";
import "dotenv/config"

const dbConnector = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 20000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            minPoolSize: 2
        })
            .then(() => console.log("The Database has been connected!"));
    }
    catch (err) {
        console.log(err.message);
    }
}

export default dbConnector;