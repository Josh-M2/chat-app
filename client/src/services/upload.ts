import axios from "axios";
import { uploadPromiseTypes } from "../types/chatComponent.types";

const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;

export const upload = async (
  data: FormData
): Promise<uploadPromiseTypes | null> => {
  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.data) return res.data;
  } catch (error) {
    console.error("error uploading serv: ", error);
  }
  return null;
};
