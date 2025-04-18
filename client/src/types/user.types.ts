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
  is_active: boolean;
};
