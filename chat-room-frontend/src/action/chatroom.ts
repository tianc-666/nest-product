import axiosInstance from "../utils/axios";

export const chatRoomAction = {
  getChatRoomHistory: (params: { chatroomId: string }) => {
    return axiosInstance.get("/chat-history/list", { params });
  },
};
