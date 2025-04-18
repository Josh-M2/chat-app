import { logout } from "../services/logoutServ";

export type Messages = {
  _id: string;
  isSender: boolean;
  content: string;
  timestamp: string;
  fileUrl?: string;
};

export type User = {
  _id: string;
  email: string;
  content: Messages[];
  isActive: boolean;
};

export type logoutProps = {
  logoutTrigger: () => void;
};
