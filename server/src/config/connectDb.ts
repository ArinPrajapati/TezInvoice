import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
``;

export const connectDB = async () => {
  try {
    console.log("MONGO_URI", process.env.connectionUrl);
    if (
      process.env.connectionUrl === null ||
      process.env.connectionUrl === undefined
    ) {
      throw new Error("MONGO_URI is not defined");
    }
    const conn = await mongoose.connect(process.env.connectionUrl!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
