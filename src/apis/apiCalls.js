import apiService from "apis/apiService";
import { user } from "apis/urls";
import { readCookie } from "utils/cookie";

export const fetchLoggedInUserData = async () => {
  const userMID = readCookie("userMID");
  if (!userMID) {
    return;
  }

  const response = await apiService(user(userMID).getById);
  if (response?.success) {
    return response?.data;
  } else {
    //
  }
};
