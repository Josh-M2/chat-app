// src/components/ChatMessage.tsx
import React from "react";

export interface ChatMessageProps {
  message: {
    _id: string;
    isSender: boolean;
    content: string;
    timestamp: string;
    fileUrl?: string;
  };
  isSender: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender }) => {
  const { content, fileUrl, timestamp } = message;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-3 m-1 ${
          isSender
            ? "bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
            : "bg-gray-200 text-black rounded-tl-lg rounded-tr-lg rounded-br-lg"
        }`}
      >
        {content && <p>{content}</p>}
        {fileUrl && (
          <div className="mt-2">
            {fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
              <img src={fileUrl} alt="file" className="w-full rounded" />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                Download File
              </a>
            )}
          </div>
        )}
        <span className="text-xs text-gray-400">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

// Sample chat messages array

export default ChatMessage;
