import userModel from "../models/userModel.js";
import dotEnv from "dotenv";
import jwt from "jsonwebtoken";

dotEnv.config();

export const signUP = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  console.log("password", password);

  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: { email_taken: "Email is already taken" } });
    }

    const newUser = await userModel.create({ email, password });
    console.log("newUser", newUser);

    const NODE_ENV = process.env.NODE_ENV;
    const token = process.env.SESSION_TOKEN;
    const tokenExpiry = process.env.SESSION_EXPIRY;

    if (newUser) {
      const TOKEN = jwt.sign({ id: newUser._id, email: newUser.email }, token, {
        expiresIn: tokenExpiry,
      });
      console.log("TOKEN", TOKEN);
      res.cookie("accessToken", TOKEN, {
        httpOnly: true,
        secure: NODE_ENV === "development", // Set to true in production (for HTTPS)
        sameSite: "Strict",
        maxAge: tokenExpiry,
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
  const socket = req.app.get("socket");
  console.log("email", email);
  console.log("password", password);

  try {
    const existingEmail = await userModel.findOne({ email });
    if (!existingEmail) {
      return res.status(404).json({ message: { emailError: "Wrong Email" } });
    }

    const isPasswordCorrect = await existingEmail.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: { passwordError: "Wrong Password" } });
    }
    console.log("existingEmail", existingEmail);

    const NODE_ENV = process.env.NODE_ENV;
    const token = process.env.SESSION_TOKEN;
    const tokenExpiry = process.env.SESSION_EXPIRY;

    const TOKEN = jwt.sign(
      { id: existingEmail._id, email: existingEmail.email },
      token,
      { expiresIn: tokenExpiry }
    );
    console.log("TOKEN", TOKEN);

    res.cookie("accessToken", TOKEN, {
      httpOnly: true,
      secure: NODE_ENV === "development",
      sameSite: "strict",
      maxAge: tokenExpiry,
    });

    res.status(200).json({
      message: "Succesfully Login",
      success: true,
      userId: existingEmail._id,
    });

    const response = await userModel.findByIdAndUpdate(
      existingEmail._id,
      { isActive: true },
      { new: true }
    );

    socket.emit("updateChatList", {
      userID: response._id,
      isActive: response.isActive,
    });
  } catch (err) {
    console.error("signup error", err);
    res.status(500).json({ message: "Error Login user" });
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
