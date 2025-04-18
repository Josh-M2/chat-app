// src/components/ChatList.tsx
import React, { useState, useEffect } from "react";
import api from "../services/api";

export interface Messages {
  _id: string;
  isSender: boolean;
  content: string;
  timestamp: string;
  fileUrl?: string;
}

export interface User {
  _id: string;
  email: string;
  content: Messages[];
  is_active: boolean;
}

// export const chatMessages: Messages[] = [
//   {
//     id: "1",
//     isSender: true,
//     content: "Hey! How are you?",
//     timestamp: "2023-10-27T10:15:00Z",
//   },
//   {
//     id: "2",
//     isSender: false,
//     content: "I'm good, thanks! Check this out!",
//     fileUrl: "https://example.com/images/",
//     timestamp: "2023-10-27T10:17:00Z",
//   },
//   {
//     id: "3",
//     isSender: true,
//     content: "Looks great! Here's a document for reference.",
//     fileUrl: "https://example.com/docs/sample-document.pdf",
//     timestamp: "2023-10-27T10:20:00Z",
//   },
//   {
//     id: "4",
//     isSender: false,
//     content: "Got it, thanks!",
//     timestamp: "2023-10-27T10:25:00Z",
//   },
// ];

// export const mockUsers: User[] = [
//   { id: "1", email: "Alice", content: chatMessages, is_active: true },
//   { id: "2", email: "Bob", content: chatMessages, is_active: false },
//   { id: "3", email: "Charlie", content: chatMessages, is_active: true },
// ];

interface ChatListProps {
  onSelectChat: (user: User) => void;
  selectedChatId: string | null;
  listOfUsers: User[];
  loadingListOfUsers: boolean;
  loggedInUserId: string;
}

const ChatList: React.FC<ChatListProps> = ({
  onSelectChat,
  selectedChatId,
  listOfUsers,
  loadingListOfUsers,
  loggedInUserId,
}) => {
  return (
    <div className="w-1/4 border-r p-2 w-[40vh] h-[53.3vh] max-h-[53.3vh] overflow-auto hide-scrollbar">
      {loadingListOfUsers
        ? "loading"
        : listOfUsers.map((user) => (
            <div
              key={user._id}
              onClick={(e) => {
                e.preventDefault();
                onSelectChat(user);
              }}
              className={`flex items-center mb-2 p-3 rounded-lg cursor-pointer ${
                user._id === selectedChatId ? "bg-blue-200" : "bg-slate-300"
              } ${user._id === loggedInUserId ? "hidden" : ""}`}
            >
              <span
                className={`dot h-3 w-3 rounded-full mr-2 ${
                  user.is_active ? "bg-green-500" : "bg-gray-500"
                }`}
              ></span>
              <p>{user.email}</p>
            </div>
          ))}
    </div>
  );
};

export default ChatList;
