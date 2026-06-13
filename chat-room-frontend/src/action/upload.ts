import axiosInstance from "../utils/axios";

export const uploadFile = async (file: File) => {
  return axiosInstance.get("/minio/presignedUrl?fileName=" + file.name);
};
