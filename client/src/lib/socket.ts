import { io } from "socket.io-client";

const beURL = `${import.meta.env.VITE_SERVER_ACCESS}`;

export const socket = io(beURL, {});
