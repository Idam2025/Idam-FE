import axiosInstance from "./axiosInstance";

export const getUserInfo = () => {
  return axiosInstance.get("/api/user/me");
};
