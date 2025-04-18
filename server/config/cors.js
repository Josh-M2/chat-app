import dotenv from "dotenv";

dotenv.config();

const feURL = process.env.CLIENT_URL;

export const corsOption = {
  origin: feURL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
