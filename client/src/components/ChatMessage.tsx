import React, { useEffect, useRef } from "react";
import { ChatMessageProps } from "../types/chatComponent.types";
import fileSVG from "../assets/file.svg";

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender }) => {
  const { content, fileUrl, timestamp } = message;
  const chatsRef = useRef<HTMLDivElement>(null);
  const isImage = fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/);
  const isFile = fileUrl && !isImage;
  const fileName = fileUrl
    ? decodeURIComponent(fileUrl.split("/").pop() || "")
    : "";

  useEffect(() => {
    chatsRef?.current?.lastElementChild?.scrollIntoView();
  }, [message]);

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        ref={chatsRef}
        className={`max-w-xs p-3 m-1 ${
          isSender
            ? "bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
            : "bg-gray-200 text-black rounded-tl-lg rounded-tr-lg rounded-br-lg"
        }`}
      >
        {content && <p className="mb-1 break-words">{content}</p>}

        {fileUrl && isImage && (
          <div className="mt-2">
            <img
              src={fileUrl}
              alt="file"
              className="w-full max-h-60 object-cover rounded"
            />
          </div>
        )}

        {fileUrl && isFile && (
          <div className="mt-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline break-words"
              download
            >
              <img src={fileSVG} alt="file" className="w-5 h-5 " />{" "}
              {fileName || "Download File"}
            </a>
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-gray-400 block mt-1">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

// Sample chat messages array

export default ChatMessage;
