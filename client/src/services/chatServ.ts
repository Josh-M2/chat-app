import { SendChatTypes } from "../types/chatComponent.types";
import { Messages } from "../types/user.types";
import axiosInst from "./api";

export const sendMessage = async (
  newMessage: SendChatTypes
): Promise<Messages | null> => {
  try {
    const response = await axiosInst.post("/chat/send-message", newMessage);

    if (response.data) {
      console.log("responseSHit:", response.data);
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};
