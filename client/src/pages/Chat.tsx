import { useEffect, useMemo, useRef, useState } from "react";
import LogOut from "../components/LogOut";
import ChatMessage from "../components/ChatMessage";
import ChatList from "../components/ChatList";
import { User } from "../types/user.types";
import {
  getSelectedChatMessages,
  getUser,
  sendMessage,
} from "../services/chatServ";
import { socket } from "../lib/socket";
// import { validateToken } from "../services/loginServ";
import { logout } from "../services/logoutServ";
import { Messages } from "../types/chatComponent.types";
import EmojiPicker from "emoji-picker-react";
import fileSVG from "../assets/file.svg";
import clipSVG from "../assets/clip.svg";
import iconSVG from "../assets/emoji.svg";

import { upload } from "../services/upload";
import { searchUser } from "../lib/sort";

const Chat: React.FC = () => {
  const loggedInUserId = useMemo(() => localStorage.getItem("userID"), []);
  const isLogin = useMemo(() => localStorage.getItem("isLogin"), []);
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [listOfUsers, setListOfUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loadingListOfUsers, setLoadingListOfUsers] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [clickedInput, setClickInput] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiButtonRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setLoadingListOfUsers(true);
    if (!isLogin) {
      window.location.href = "/";
    } else {
      const fetchUsers = async () => {
        try {
          const response = await getUser();
          if (typeof response === "number" && response === 401) {
            await handlelogOut();
          } else {
            setListOfUsers(response);
            setFilteredUsers(response);
          }
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

  useEffect(() => {
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

  const handleChatSelect = async (chat: User) => {
    if (chat._id === selectedChat?._id) {
      return;
    }

    setSelectedChat(chat);
    setInputValue("");
    setselectedFile(null);
    setLoadingMessages(true);

    console.log("chat.id", chat._id);

    try {
      const response = await getSelectedChatMessages(
        chat._id,
        loggedInUserId as string
      );
      console.log("handleChatSelect response", response);

      if (typeof response === "number" && response === 401) {
        await handlelogOut();
      } else {
        setMessages(
          response.map((msg: Messages) => ({
            _id: msg._id,
            isSender: msg.senderId === loggedInUserId,
            content: msg.content,
            timestamp: msg.timestamp,
            fileUrl: msg.fileUrl,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
    setLoadingMessages(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;
    if (!selectedChat) return;

    setSending(true);
    let fileUrl = "";
    let fileType = "";

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "chatapp-preset");

      try {
        const response = await upload(formData);
        console.log("cloudinary", response);

        if (response?.secure_url) {
          fileUrl = response.secure_url;
          fileType = response.resource_type;
        } else {
          throw new Error("Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("File upload failed.");
        setSending(false);
        return;
      }
    }

    const newMessage = {
      senderId: loggedInUserId,
      receiverId: selectedChat._id,
      content: inputValue,
      fileUrl: fileUrl,
      fileType: fileType,
    };

    try {
      const response = await sendMessage(newMessage);
      if (response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...response, isSender: true },
        ]);
      }

      setInputValue("");
      setselectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setSending(false);
  };

  const handlelogOut = async () => {
    try {
      console.log("loggedInUserId", loggedInUserId);
      await logout(String(loggedInUserId));
    } catch (error) {
      console.error("error logout:", error);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;

    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const text = inputValue;

    const updatedText =
      text?.substring(0, start) + emoji + text.substring(end, text.length);

    setInputValue(updatedText);

    // Move cursor after emojiz
    setTimeout(() => {
      input.setSelectionRange(start + emoji.length, start + emoji.length);
      input.focus();
    }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      return alert("Max file size is 25mb");
    }

    setselectedFile(file);

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    console.log(search);
    const response = searchUser(search, listOfUsers);
    console.log("search response: ", response);
    setFilteredUsers(response as User[]);
  }, [search]);
  return (
    <>
      <div className="flex items-end rounded-lg gap-3">
        <div className="border rounded-lg">
          <div className="p-4 shadow-md ">
            <h2>Chats</h2>
            <input
              type="text"
              name="search"
              value={search}
              placeholder="Search here"
              className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-3"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ChatList
            onSelectChat={handleChatSelect}
            selectedChatId={selectedChat?._id || null}
            listOfUsers={filteredUsers}
            setListOfUsers={setFilteredUsers}
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
            className="overflow-y-auto px-4 h-[500px] overflow-auto"
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
          {selectedFile && (
            <div className="p-2 border-t bg-gray-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className="w-24 h-auto rounded"
                    alt="preview"
                  />
                ) : (
                  <div className="text-sm text-gray-700 truncate max-w-[200px] flex items-center gap-2">
                    <img src={fileSVG} alt="file" className="w-5 h-5 " />{" "}
                    <span>{selectedFile.name}</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setselectedFile(null);
                  setPreviewUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
              >
                &times;
              </button>
            </div>
          )}
          <form className="flex p-2 border-t" onSubmit={handleSendMessage}>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="*/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-transparent rounded mr-1"
              >
                <img src={clipSVG} alt="attach file" className="w-5 h-5 " />
              </button>
            </div>
            <input
              ref={inputRef}
              type="text"
              accept="*/*"
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setClickInput(true);
              }}
              onClick={() => setClickInput(true)}
            />
            <div className="relative inline-block" ref={emojiButtonRef}>
              <button
                type="button"
                onClick={toggleEmojiPicker}
                className="ml-2 p-2 bg-transparent text-white rounded-md"
              >
                <img src={iconSVG} alt="emojis" className="w-5 h-5 " />
              </button>

              {showEmojiPicker && (
                <div className="absolute z-10 bottom-full mb-2 right-[-71px] ">
                  <EmojiPicker
                    lazyLoadEmojis={true}
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white rounded-md"
              disabled={sending}
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
