import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/mongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import threadRoutes from "./routes/threadRoutes.js";
import dotEnv from "dotenv";
import cookieParser from "cookie-parser";
import { corsOption } from "./config/cors.js";
import { initServer } from "./config/socketIO.js";

dotEnv.config();
const app = express();
const server = http.createServer(app);
const io = initServer(server);
const PORT = process.env.PORT || 5000;

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.set("socket", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", threadRoutes);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
