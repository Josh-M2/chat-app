// server/routes/messages.js

import userThreadModel from "../models/userThreadModel.js";
import userModel from "../models/userModel.js";

export const getUser = async (req, res) => {
  const users = await userModel.find().select("email isActive");
  if (users.length > 1) {
    res.status(200).json(users);
  } else {
    res.status(404).json(null);
  }
};

// Endpoint to send a message
export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content, fileUrl } = req.body;

  try {
    const newMessage = new userThreadModel({
      senderId,
      receiverId,
      content,
      fileUrl,
    });

    await newMessage.save(); // Save the message to the database
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

// Endpoint to get messages between two users
export const getMessages = async (req, res) => {
  const { userId, loggedInUserId } = req.query;

  console.log("userId", userId);
  console.log("loggedInUserId", loggedInUserId);

  try {
    const messages = await userThreadModel
      .find({
        $or: [
          { senderId: loggedInUserId, receiverId: userId },
          { senderId: userId, receiverId: loggedInUserId },
        ],
      })
      .sort({ timestamp: 1 }); // Sort messages by timestamp

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};
