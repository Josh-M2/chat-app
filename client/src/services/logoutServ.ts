import axiosInst from "./api";

export const logout = async (id: string) => {
  await axiosInst.post(
    "/auth/logout",
    {
      params: {
        userID: id,
      },
    },
    { withCredentials: true }
  );

  localStorage.removeItem("isLogin");
  localStorage.removeItem("userID");
  window.location.href = "/";
};
