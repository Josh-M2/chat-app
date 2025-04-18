// src/components/ChatList.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ChatListProps } from "../types/chatComponent.types";
import { socket } from "../lib/socket";
import { connect } from "http2";
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

const ChatList: React.FC<ChatListProps> = ({
  onSelectChat,
  selectedChatId,
  listOfUsers,
  setListOfUsers,
  loadingListOfUsers,
  clickedInput,
}) => {
  const loggedInUserId = useMemo(() => localStorage.getItem("userID"), []);
  const [notifiedReceivers, setNotifiedReceivers] = useState<Set<string>>(
    new Set()
  );

  // useEffect(() => {
  //   console.log("selectedChatId", selectedChatId);
  // }, [selectedChatId]);

  // useEffect(() => {
  //   console.log("loggedInUserId", loggedInUserId);
  // }, [loggedInUserId]);

  //

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected! ID:", socket.id);
    });

    socket.on("receiveNotification", (payload) => {
      console.log("id of recevier", payload);
      setNotifiedReceivers((prev) => new Set(prev).add(payload));
    });

    socket.on("updateChatList", ({ userID, isActive }) => {
      setListOfUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userID ? { ...user, isActive } : user
        )
      );
    });

    return () => {
      socket.off("connect");
      socket.off("receiveNotification");
      socket.off("updateChatList");
    };
  }, []);

  useEffect(() => {
    if (clickedInput) removeRedDot(String(selectedChatId));
  }, [clickedInput, selectedChatId]);

  const removeRedDot = (userId: string) => {
    setNotifiedReceivers((prev) => {
      const updated = new Set(prev);
      updated.delete(userId);
      return updated;
    });
  };

  return (
    <div className="relative w-1/4 border-r p-2 w-[40vh] h-[53.3vh] max-h-[53.3vh] overflow-auto hide-scrollbar">
      {loadingListOfUsers
        ? "loading"
        : listOfUsers
            .slice()
            .sort((a, b) => Number(b.isActive) - Number(a.isActive))
            .map((user, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectChat(user);
                  console.log("user._id", user);
                }}
                className={`flex items-center mb-2 p-3 rounded-lg cursor-pointer ${
                  user._id === selectedChatId ? "bg-blue-300" : "bg-slate-100"
                } ${user._id === loggedInUserId ? "hidden" : ""}`}
              >
                {notifiedReceivers.has(user._id) && (
                  <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-500" />
                )}
                <span
                  className={`dot h-3 w-3 rounded-full mr-2 ${
                    user.isActive ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>
                <p>{user.email}</p>
              </div>
            ))}
    </div>
  );
};

export default ChatList;
