import { successfulLogin } from "../types/form.types";
import axiosInst from "./api";

export const signupServ = async (
  email: string,
  password: string,
  captchaToken: string
): Promise<successfulLogin | null> => {
  try {
    console.log("signup creds: ", email, password);
    const response = await axiosInst.post(
      "/auth/signup",
      {
        email: email,
        password: password,
        captchaToken: captchaToken,
      },
      {
        withCredentials: true,
      }
    );
    if (response.data) {
      console.log("signup res data: ", response.data.success);
      return response.data;
    }
  } catch (error: any) {
    if (error.status === 400 && error.response.data.message.email_taken) {
      console.log("takenemail: ", error.response.data.message.email_taken);
      return error.response.data.message;
    }

    if (error.status === 429 && error.response.data.message.limiter) {
      console.log("error", error.response.data.message.limiter);
      return error.response.data.message;
    }

    console.error(
      "Signup serv Error: ",
      error.response.data.message.email_taken
    );
  }

  return null;
};
