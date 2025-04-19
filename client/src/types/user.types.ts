import { Messages } from "./chatComponent.types";

export type User = {
  _id: string;
  email: string;
  content: Messages[];
  isActive: boolean;
};

export type logoutProps = {
  logoutTrigger: () => void;
};
