export type SignupForm = {
  email: string;
  password: string;
  repeat_password: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type successfulLogin = {
  success: boolean;
  userId?: string;
  emailError?: string;
  passwordError?: string;
  limiter?: string;
  requiresCaptcha?: boolean;
  email_taken?: string;
};
