import express from "express";
import {
  signUP,
  logIn,
  logOut,
  validateToken,
} from "../controllers/authController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", rateLimiter, signUP);
router.post("/login", rateLimiter, logIn);
router.post("/logout", logOut);
// router.get("/validate-token", validateToken);

export default router;
