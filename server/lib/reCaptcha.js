import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || "";
  const url = `https://www.google.com/recaptcha/api/siteverify`;

  const { data } = await axios.post(
    url,
    {},
    {
      params: {
        secret: secretKey,
        response: token,
      },
    }
  );

  return data.success;
};

export const handleCaptcha = async (req, captchaToken, res) => {
  const tooManyAttempts =
    req.rateLimit?.limit && req.rateLimit?.remaining === 0;

  if (tooManyAttempts) {
    if (!captchaToken) {
      return res
        .status(400)
        .json({ message: "CAPTCHA required", requiresCaptcha: true });
    }

    const captchaValid = await verifyRecaptcha(captchaToken);
    if (!captchaValid) {
      return res.status(400).json({ message: "Invalid CAPTCHA" });
    }
  }
};
