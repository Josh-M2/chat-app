import { useEffect, useState } from "react";
import LogOut from "../components/LogOut";
import ChatMessage from "../components/ChatMessage";
import ChatList from "../components/ChatList";
import api from "../services/api";
import { Messages, User } from "../types/user.types";

const Chat: React.FC = () => {
  const isLogin = localStorage.getItem("isLogin");
  const loggedInUserId = localStorage.getItem("userID");
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [listOfUsers, setListOfUsers] = useState<User[]>([]);
  const [loadingListOfUsers, setLoadingListOfUsers] = useState<boolean>(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  useEffect(() => {
    setLoadingListOfUsers(true);
    if (!isLogin) {
      window.location.href = "/";
    } else {
      const fetchUsers = async () => {
        try {
          const response = await api.get("/chat/get-user");

          setListOfUsers(response.data);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      };
      fetchUsers();
    }
    setLoadingListOfUsers(false);
  }, [isLogin]);

  const handleChatSelect = async (chat: User) => {
    if (chat._id === selectedChat?._id) {
      return;
    }

    setSelectedChat(chat);
    setLoadingMessages(true);

    console.log("chat.id", chat._id);

    try {
      const response = await api.get("/chat/get-messages", {
        params: { userId: chat._id, loggedInUserId: loggedInUserId },
      });
      setMessages(
        response.data.map((msg: any) => ({
          id: msg._id,
          isSender: msg.senderId === loggedInUserId,
          content: msg.content,
          timestamp: msg.timestamp,
          fileUrl: msg.fileUrl,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
    setLoadingMessages(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("inputed", input);

    if (!input.trim() || !selectedChat) return;

    // const highestId = chat.messages.reduce(
    //   (maxId, message) => Math.max(maxId, message.id),
    //   0
    // );

    const newMessage = {
      senderId: loggedInUserId,
      receiverId: selectedChat._id,
      content: input,
      fileUrl: "", // Adjust if you want to handle files
    };

    try {
      const response = await api.post("/chat/send-message", newMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...response.data, isSender: true },
      ]);

      setInput(""); // Clear input field
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
      <div className="flex items-end rounded-lg gap-3">
        <div className="border rounded-lg">
          <div className="p-4 shadow-md ">
            <h2>Chats</h2>
            <input
              type="text"
              placeholder="Search here"
              className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-3"
            />
          </div>

          <ChatList
            onSelectChat={handleChatSelect}
            selectedChatId={selectedChat?.email || null}
            listOfUsers={listOfUsers}
            loadingListOfUsers={loadingListOfUsers}
            loggedInUserId={loggedInUserId || ""}
          />
          <div className="flex items-stretch flex-col p-3">
            <LogOut />
          </div>
        </div>
        <div className="flex flex-col h-full w-[600px] border rounded-lg">
          <div className="p-4 shadow-md min-h-[56px]">
            {selectedChat && (
              <div className="flex flex-row items-center gap-3">
                {selectedChat.email}
                <span
                  className={`dot h-3 w-3 rounded-full mr-2 ${
                    selectedChat.is_active ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>
              </div>
            )}
          </div>
          <div className="overflow-y-auto px-4 h-[410px] overflow-auto">
            {loadingMessages
              ? "loading"
              : messages.map((msg) => (
                  <ChatMessage
                    key={msg._id}
                    message={msg}
                    isSender={msg.isSender}
                  />
                ))}
          </div>
          <form className="flex p-2 border-t" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white rounded-md"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
