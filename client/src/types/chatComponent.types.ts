import { User } from "./user.types";

export type ChatListProps = {
  onSelectChat: (user: User) => void;
  selectedChatId: string | null;
  listOfUsers: User[];
  loadingListOfUsers: boolean;
  loggedInUserId: string;
};

export type ChatMessageProps = {
  message: {
    _id: string;
    isSender: boolean;
    content: string;
    timestamp: string;
    fileUrl?: string;
  };
  isSender: boolean;
};
