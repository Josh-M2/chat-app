import rateLimit from "express-rate-limit";
import { verifyRecaptcha } from "../lib/reCaptcha.js";

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute
  max: 5,
  keyGenerator: (req) => req.ip || "unknow",
  handler: (req, res) => {
    res.status(429).json({
      message: {
        limiter: "Too many login attempts, CAPTCHA required.",
        requiresCaptcha: true,
      },
    });
  },
  skip: async (req, res) => {
    const captchaToken = req.body.captchaToken;
    if (captchaToken) {
      //   console.log(captchaToken, "captchaToken");
      const isValid = await verifyRecaptcha(captchaToken);
      return isValid;
    }
    return false;
  },
});
