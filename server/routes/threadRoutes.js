import express from "express";
import {
  sendMessage,
  getMessages,
  getUser,
} from "../controllers/threadController.js";

const router = express.Router();

router.post("/send-message", sendMessage);

router.get("/get-messages", getMessages);
router.get("/get-user", getUser);

export default router;
