import axiosInst from "./api";

export const loginServ = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
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
      console.log("login serv resp: ", response.data.success);
      return String(response.data.success);
    }
  } catch (error: any) {
    if (error.status === 404 && error.response.data.message.email) {
      console.log("error", error.response.data.message.email);

      return "email";
    }
    if (error.status === 400 && error.response.data.message.password) {
      console.log("error", error.response.data.message.password);
      return "password";
    }

    console.error("error login serv: ", error);
  }
  return null;
};
