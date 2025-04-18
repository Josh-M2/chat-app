const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isEmpty = (value: string): boolean => value.trim() === "";

const requiredMessage = (field: string) => `${field} is required`;

export const validateEmail = (email: string): string => {
  if (isEmpty(email)) return requiredMessage("Email address");
  if (!isValidEmail(email)) return "Invalid email address";
  return "";
};

export const validatePassword = (
  password: string,
  component: string
): string => {
  if (isEmpty(password)) return requiredMessage("Password");

  if (component === "signup" && password.length < 12) {
    return "Password must be at least 12 characters";
  }

  return "";
};

export const validateRepeatPassword = (
  repeatPassword: string,
  originalPassword: string
): string => {
  if (isEmpty(repeatPassword)) return requiredMessage("Password");
  if (repeatPassword !== originalPassword) return "Passwords do not match";
  return "";
};
