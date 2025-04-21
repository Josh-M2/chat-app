import { User } from "../types/user.types";

export const searchUser = (
  value: string,
  listOfUsers: User[]
): User[] | null => {
  try {
    let filteredData = listOfUsers;
    const searchLower = value.trim().toLowerCase();

    filteredData = filteredData.filter((item: User) =>
      item.email.toLowerCase().includes(searchLower)
    );
    // console.log("filteredData", filteredData);
    return filteredData;
  } catch (error) {
    console.error("error sort", error);
  }
  return null;
};
