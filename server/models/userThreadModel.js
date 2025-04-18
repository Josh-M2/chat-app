// server/models/MessageModel.js
import mongoose from "mongoose";

const userThreadModelSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to User
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to User
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  fileUrl: { type: String, default: "" },
});

const userThreadModel = mongoose.model("Message", userThreadModelSchema);

export default userThreadModel;
