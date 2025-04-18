import React from "react";
import api from "../services/api";

const LogOut: React.FC = () => {
  const logOut = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("isLogin");
      window.location.href = "/";
    } catch (error) {
      console.error("error logout:", error);
    }
  };
  return (
    <>
      <button onClick={logOut} className="m-2 border border-slate-400">
        Log Out
      </button>
    </>
  );
};

export default LogOut;
