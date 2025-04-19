import { Messages, SendChatTypes } from "../types/chatComponent.types";
import { User } from "../types/user.types";
import axiosInst from "./api";

export const sendMessage = async (
  newMessage: SendChatTypes
): Promise<Messages | null> => {
  try {
    const response = await axiosInst.post("/chat/send-message", newMessage, {
      withCredentials: true,
    });

    if (response.data) {
      console.log("responseSHit:", response.data);
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const getUser = async (): Promise<User[] | 401> => {
  try {
    const response = await axiosInst.get("/chat/get-user", {
      withCredentials: true,
    });
    if (response.data) return response.data;
  } catch (error: any) {
    if (error.status === 401) {
      return error.status;
    }
    console.error("error getting usersrs: ", error);
  }
  return [];
};

export const getSelectedChatMessages = async (
  userId: string,
  loggedInUserId: string
): Promise<Messages[] | 401> => {
  try {
    const response = await axiosInst.get("/chat/get-messages", {
      params: { userId, loggedInUserId },
      withCredentials: true,
    });
    if (response) console.log("getSelectedChatMessages:", response.data);
    if (response) return response.data;
  } catch (error: any) {
    if (error.status === 401) {
      return error.status;
    }
    console.error("error getting usersrs: ", error);
  }
  return [];
};
