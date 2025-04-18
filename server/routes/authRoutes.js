import express from "express";
import { signUP, logIn, logOut } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUP);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;
