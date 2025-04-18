import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const clientURL = process.env.CLIENT_URL;

export const initServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: clientURL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("disconnect", (reason) => {
      console.log(`A user disconnected:  ${socket.id} due to ${reason}`);
    });
  });

  return io;
};
