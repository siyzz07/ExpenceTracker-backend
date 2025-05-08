import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async (): Promise<void> => {
  try {
    const Mongodb_URL: string = process.env.MONGODB_URL || "";
    await mongoose.connect(Mongodb_URL);

    console.log("database connected.....");
  } catch (error) {
    console.log("error to connect database");
  }
};

export default connectDB;
