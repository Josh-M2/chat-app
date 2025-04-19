import express from "express";
import {
  sendMessage,
  getMessages,
  getUser,
} from "../controllers/threadController.js";
import {
  renewAuthUser,
  verifyToken,
} from "../middleware/authUserMiddleware.js";

const router = express.Router();

router.post("/send-message", renewAuthUser, sendMessage);
router.get("/get-messages", verifyToken, getMessages);
router.get("/get-user", verifyToken, getUser);

export default router;
