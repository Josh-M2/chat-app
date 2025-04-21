import React, { useMemo } from "react";
import { logoutProps } from "../types/user.types";

const LogOut: React.FC<logoutProps> = ({ logoutTrigger }) => {
  return (
    <>
      <button
        onClick={logoutTrigger}
        className="m-2 border border-slate-400 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
      >
        Log Out
      </button>
    </>
  );
};

export default LogOut;
