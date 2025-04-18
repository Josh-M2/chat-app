import { successfulLogin } from "../types/form.types";
import axiosInst from "./api";

export const loginServ = async (
  email: string,
  password: string
): Promise<successfulLogin | null> => {
  try {
    console.log("email", email);
    const response = await axiosInst.post(
      "/auth/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );

    if (response) {
      console.log("login serv resp: ", response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error.status === 404 && error.response.data.message.emailError) {
      console.log("error", error.response.data.message.emailError);

      return error.response.data.message;
    }
    if (error.status === 400 && error.response.data.message.passwordError) {
      console.log("error", error.response.data.message.passwordError);
      return error.response.data.message;
    }

    console.error("error login serv: ", error);
  }
  return null;
};

export const validateToken = async () => {
  try {
    const response = await axiosInst.get("/auth/validate-token", {
      withCredentials: true,
    });
    if (response) {
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};
