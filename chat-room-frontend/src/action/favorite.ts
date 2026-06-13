import axiosInstance from "../utils/axios";

export const favoriteAction = {
  favoriteChatHistory: (params: { chatHistoryId: number }) => {
    return axiosInstance.post("/favorite/add", params);
  },
  getFavoriteList: () => {
    return axiosInstance.get("/favorite/list");
  },
  delFavorite: (params: { chatHistoryId: number }) => {
    return axiosInstance.post("/favorite/del", params);
  },
};
