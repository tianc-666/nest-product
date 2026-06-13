import axiosInstance from "../utils/axios";

export const friendsService = {
  getFriendsList: (params?: { nickName: string }) => {
    return axiosInstance.get("/friend-ship/list", { params });
  },
  addFriend: (params: { nickName: string }) => {
    return axiosInstance.post("/friend-ship/add", params);
  },
  getFriendRequestList: () => {
    return axiosInstance.get("/friend-ship/request-list");
  },
  agreeFriendRequest: (params: { friendId: number }) => {
    return axiosInstance.post("/friend-ship/agree", params);
  },
  rejectFriendRequest: (params: { friendId: number }) => {
    return axiosInstance.post("/friend-ship/reject", params);
  },
  findChatRoomId: (params: { friendId: number }) => {
    return axiosInstance.get("/chatroom/find-chat-room", { params });
  },
  createChatRoom: (params: { friendId: number; type: number }) => {
    return axiosInstance.post("/chatroom/create", params);
  },
};
