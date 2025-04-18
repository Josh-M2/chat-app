import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully with Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // Exit the process with failure
  }
};

// Optional: Close the connection when the application is terminated
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

export { connectDB };
