import axiosInstance from "../utils/axios";

export const groupChatAction = {
  getGroupChatList: (params: { name: string }) => {
    return axiosInstance.get("/chatroom/list?type=1", { params });
  },
  getChatList: (params: { name: string }) => {
    return axiosInstance.get("/chatroom/list", { params });
  },
  createGroupChat: (params: { name: string; type: number }) => {
    return axiosInstance.post("/chatroom/create", params);
  },
  getGroupChatUserInfo: (id: number) => {
    return axiosInstance.get(`/chatroom/members?id=${id}`);
  },
  joinGroupChat: (id: number) => {
    return axiosInstance.get(`/chatroom/join/${id}`);
  },
  isJoinChatRoom: (id: number) => {
    return axiosInstance.get(`/chatroom/is-join?chatRoomId=${id}`);
  },
  addUserToGroupChat: (params: { chatroomId: number; friendNames: string }) => {
    return axiosInstance.post("/chatroom/add-member", params);
  },
  getUserChatRoomList: (params?: { name: string }) => {
    return axiosInstance.get("/chatroom/user-chatroom", { params });
  },
  outGroupChat: (id: number) => {
    return axiosInstance.get(`/chatroom/out-user-chatroom/${id}`);
  },
};
