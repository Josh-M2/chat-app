import userModel from "../models/userModel.js";
import dotEnv from "dotenv";

dotEnv.config();

export const signUP = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  console.log("password", password);

  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const newUser = await userModel.create({ email, password });
    console.log("newUser", newUser);

    if (newUser) {
      const TOKEN = process.env.SESSION_TOKEN;
      console.log("TOKEN", TOKEN);
      res.cookie("accessToken", TOKEN, {
        httpOnly: true,
        secure: false, // Set to true in production (for HTTPS)
        sameSite: "Strict",
        maxAge: 32400000,
      });
      res.status(200).json({
        message: "Succesfully registered",
        success: true,
        userId: newUser._id,
      });
    }
  } catch (err) {
    console.error("signup error", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  console.log("password", password);

  try {
    const existingEmail = await userModel.findOne({ email });
    if (!existingEmail) {
      return res.status(404).json({ message: "Invalid Email" });
    }

    const isPasswordCorrect = await existingEmail.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const TOKEN = process.env.SESSION_TOKEN;
    console.log("TOKEN", TOKEN);

    res.cookie("accessToken", TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 32400000,
    });

    res.status(200).json({
      message: "Succesfully Login",
      success: true,
      userId: existingEmail._id,
    });
  } catch (err) {
    console.error("signup error", err);
    res.status(500).json({ message: "Error Login user" });
  }
};

export const logOut = async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
};
