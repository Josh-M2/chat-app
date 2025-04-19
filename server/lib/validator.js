import sanitize from "sanitize-html";

export const inputValidator = (email, password) => {
  const error = { email: "", password: "" };

  email = sanitize(email);
  password = sanitize(password);

  if (!email) {
    error.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.email = "Invalid email format.";
  }

  if (!password) {
    error.password = "Password is required.";
  }

  if (error.email !== "" && error.email !== "") {
    return error;
  } else {
    return null;
  }
};
