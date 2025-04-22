import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateAndSetToken = (user, res) => {
  const NODE_ENV = process.env.NODE_ENV;
  const token = process.env.SESSION_TOKEN;
  const tokenExpiry = process.env.SESSION_EXPIRY;

  const signedToken = jwt.sign({ id: user._id, email: user.email }, token, {
    expiresIn: tokenExpiry,
  });

  res.cookie("accessToken", signedToken, {
    httpOnly: true,
    secure: NODE_ENV === "development",
    sameSite: NODE_ENV === "development" ? "None" : "strict",
    maxAge: tokenExpiry,
  });

  return signedToken;
};
