import axiosInst from "./api";

export const signupServ = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    console.log("signup creds: ", email, password);
    const response = await axiosInst.post(
      "/auth/signup",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    if (response.data) {
      console.log("signup res data: ", response.data.success);
      return String(response.data.success);
    }
  } catch (error: any) {
    if (error.status === 400 && error.response.data.message.email_taken) {
      console.log("takenemail: ", error.response.data.message.email_taken);
      return "taken";
    }
    console.error(
      "Signup serv Error: ",
      error.response.data.message.email_taken
    );
  }

  return null;
};
