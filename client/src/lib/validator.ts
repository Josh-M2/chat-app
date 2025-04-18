//Signup Validors

export const validateEmail = (email: string): string => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return "Email address is required";
  }

  if (!re.test(email)) {
    return "Invalid email address";
  }

  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return "Password is required";
  }

  if (!(password.length >= 12)) {
    return "Password must be at least 12 characters";
  }

  return "";
};

export const validateRepeatPassword = (
  repeat_password: string,
  current_password: string
): string => {
  if (repeat_password === "") {
    return "Password is required";
  }
  if (repeat_password !== current_password) {
    return "Passwords do not match";
  }
  return "";
};
