import userModel from "../models/userModel.js";
import dotEnv from "dotenv";
import jwt from "jsonwebtoken";
import { handleCaptcha, verifyRecaptcha } from "../lib/reCaptcha.js";
import { inputValidator } from "../lib/validator.js";
import { generateAndSetToken } from "../lib/authenthicateUser.js";

dotEnv.config();

export const signUP = async (req, res) => {
  const socket = req.app.get("socket");

  const { email, password, captchaToken } = req.body;

  const validationError = inputValidator(email, password);
  if (validationError)
    return res.status(400).json({ message: validationError });

  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: { email_taken: "Email is already taken" } });
    }

    await handleCaptcha(req, captchaToken, res);

    const newUser = await userModel.create({ email, password });
    if (newUser) {
      const token = generateAndSetToken(newUser, res);
      res.status(200).json({
        message: "Successfully registered",
        success: true,
        userId: newUser._id,
      });

      const updatedUser = await userModel.findByIdAndUpdate(
        newUser._id,
        { isActive: true },
        { new: true }
      );

      socket.emit("updateChatList", {
        userID: updatedUser._id,
        isActive: updatedUser.isActive,
      });
    }
  } catch (err) {
    console.error("signup error", err);
    res.status(500).json({ message: "Error creat user" });
  }
};

export const logIn = async (req, res) => {
  const { email, password, captchaToken } = req.body;
  const socket = req.app.get("socket");

  const validationError = inputValidator(email, password);
  if (validationError)
    return res.status(400).json({ message: validationError });

  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: { emailError: "Wrong Email" } });
    }

    const isPasswordCorrect = await existingUser.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: { passwordError: "Wrong Password" } });
    }

    await handleCaptcha(req, captchaToken, res);

    const token = generateAndSetToken(existingUser, res);

    res.status(200).json({
      message: "Successfully Logged In",
      success: true,
      userId: existingUser._id,
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      existingUser._id,
      { isActive: true },
      { new: true }
    );

    socket.emit("updateChatList", {
      userID: updatedUser._id,
      isActive: updatedUser.isActive,
    });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Error logging in user" });
  }
};

export const validateToken = async (req, res) => {
  const token = req.cookies.accessToken;
  const userAuthSessionToken = process.env.SESSION_TOKEN;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, userAuthSessionToken);
    res.json({ isValid: true, user: decoded.id });
  } catch (err) {
    res.status(401).json({ isValid: false });
  }
};

export const logOut = async (req, res) => {
  const socket = req.app.get("socket");
  console.log("req.body.params.userId", req.body.params.userID);
  const response = await userModel.findByIdAndUpdate(
    req.body.params.userID,
    { isActive: false },
    { new: true }
  );
  console.log("logout response: ", response);
  socket.emit("updateChatList", {
    userID: response._id,
    isActive: response.isActive,
  });
  res.clearCookie("accessToken");

  res.status(200).json({ message: "Logged out successfully" });
};
