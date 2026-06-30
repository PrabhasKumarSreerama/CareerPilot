import mongoose from "mongoose";

const connectToMongo = async () => {
  try {
    const nt = new Date().getTime();
    const dbUri = process.env.MONGO_URI || process.env.MONGODB_URL;
    await mongoose.connect(dbUri as string);
    console.log("Connected to MongoDB", new Date().getTime() - nt, "ms");
  } catch (err) {
    console.error("Database connection failed: ", err);
  }
};

export default connectToMongo;