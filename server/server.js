import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/mongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import threadRoutes from "./routes/threadRoutes.js";
import dotEnv from "dotenv";
import cookieParser from "cookie-parser";

dotEnv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", threadRoutes);

// Socket.io Setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
