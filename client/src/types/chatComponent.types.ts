import { User } from "./user.types";

export type ChatListProps = {
  onSelectChat: (user: User) => void;
  selectedChatId: string | null;
  listOfUsers: User[];
  setListOfUsers: React.Dispatch<React.SetStateAction<User[]>>;
  loadingListOfUsers: boolean;
  clickedInput?: boolean;
};

export type ChatMessageProps = {
  message: {
    _id: string;
    isSender: boolean;
    content: string;
    timestamp: string;
    fileUrl?: string;
    fileType?: string;
  };
  isSender: boolean;
};

export type SendChatTypes = {
  senderId: string | null;
  receiverId: string;
  content: string;
  fileUrl: string;
  fileType: string;
};

export type Messages = {
  _id: string;
  isSender: boolean;
  content: string;
  timestamp: string;
  senderId?: string;
  fileUrl?: string;
  fileType?: string;
};
