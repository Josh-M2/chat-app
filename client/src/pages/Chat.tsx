import { useEffect, useMemo, useState } from "react";
import LogOut from "../components/LogOut";
import ChatMessage from "../components/ChatMessage";
import ChatList from "../components/ChatList";
import api from "../services/api";
import { Messages, User } from "../types/user.types";
import { sendMessage } from "../services/chatServ";
import { socket } from "../lib/socket";
import { validateToken } from "../services/loginServ";
import { logout } from "../services/logoutServ";

const Chat: React.FC = () => {
  const loggedInUserId = useMemo(() => localStorage.getItem("userID"), []);
  const isLogin = useMemo(() => localStorage.getItem("isLogin"), []);
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [listOfUsers, setListOfUsers] = useState<User[]>([]);
  const [loadingListOfUsers, setLoadingListOfUsers] = useState<boolean>(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [clickedInput, setClickInput] = useState<boolean>(false);
  const [autoLogout, setAutoLogout] = useState<boolean>(false);

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

  //reset the clickInput Stateshit
  useEffect(() => {
    if (clickedInput) {
      const timer = setTimeout(() => setClickInput(false), 500);
      return () => clearTimeout(timer);
    }
  }, [clickedInput]);

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
      console.log("loggedInUserIdloggedInUserId", loggedInUserId);
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
      const response = await sendMessage(newMessage);
      console.log("response", response);

      if (response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...response, isSender: true },
        ]);
      }

      setInput(""); // Clear input field
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    //socket logic lister here
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected! ID:", socket.id);
    });

    socket.on("updateChat", (payload) => {
      if (payload.senderId !== loggedInUserId) {
        console.log("new message!!: ", payload);
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...payload, isSender: false },
        ]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("updateChat");
    };
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const response = await validateToken();

        if (response) {
          // User is authenticated, continue as normal
          console.log("response", response);
          console.log("valid tokens");
        } else {
          console.log("invalidtoken");
          await handlelogOut();
        }
      } catch (err) {
        console.error("Auth validation failed:", err);
        localStorage.clear();
        // window.location.href = "/";
      }
    };

    checkToken();
  }, []);

  const handlelogOut = async () => {
    try {
      await logout(String(loggedInUserId));
    } catch (error) {
      console.error("error logout:", error);
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
            selectedChatId={selectedChat?._id || null}
            listOfUsers={listOfUsers}
            setListOfUsers={setListOfUsers}
            loadingListOfUsers={loadingListOfUsers}
            clickedInput={clickedInput}
          />
          <div className="flex items-stretch flex-col p-3">
            <LogOut logoutTrigger={handlelogOut} />
          </div>
        </div>
        <div className="flex flex-col h-full w-[600px] border rounded-lg">
          <div
            className="p-4 shadow-md min-h-[56px]"
            onClick={() => setClickInput(true)}
          >
            {selectedChat && (
              <div className="flex flex-row items-center gap-3">
                {selectedChat.email}
                <span
                  className={`dot h-3 w-3 rounded-full mr-2 ${
                    selectedChat.isActive ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>
              </div>
            )}
          </div>
          <div
            className="overflow-y-auto px-4 h-[410px] overflow-auto"
            onClick={() => setClickInput(true)}
          >
            {loadingMessages
              ? "loading"
              : messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
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
              onChange={(e) => {
                setInput(e.target.value);
                setClickInput(true);
              }}
              onClick={() => setClickInput(true)}
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
