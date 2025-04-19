import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userAuthSessionToken = process.env.SESSION_TOKEN;
const tokenExpiry = process.env.SESSION_EXPIRY;
const NODE_ENV = process.env.NODE_ENV;

export const renewAuthUser = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: "Unathourize" });
  try {
    const userData = jwt.verify(token, userAuthSessionToken);
    console.log("userData", userData);

    const renewAuth = jwt.sign(userData, userAuthSessionToken);

    res.cookie("accessToken", renewAuth, {
      httpOnly: true,
      secure: NODE_ENV === "development",
      sameSite: "strict",
      maxAge: tokenExpiry,
    });

    req.user = userData;
    console.log("renewed logged in session token");
    next();
  } catch (error) {
    console.error("error auth middleware: ", error);
  }
};

export const verifyToken = (req, res, next) => {
  const authToken = req.cookies.accessToken;
  if (!authToken) return res.status(401).json({ message: "unauthorized" });

  try {
    const decoded = jwt.verify(authToken, userAuthSessionToken);

    if (!decoded)
      return res.status(401).json({ message: "unauthorized", isValid: false });

    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", isValid: false });
  }

  return null;
};
