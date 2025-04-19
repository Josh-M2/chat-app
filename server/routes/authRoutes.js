import express from "express";
import {
  signUP,
  logIn,
  logOut,
  validateToken,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUP);
router.post("/login", logIn);
router.post("/logout", logOut);
// router.get("/validate-token", validateToken);

export default router;
