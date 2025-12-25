import mongoose from "mongoose";

const connectDB = async() => {
    try{
        const connectDB = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${connectDB.connection.host}`);
    }catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;