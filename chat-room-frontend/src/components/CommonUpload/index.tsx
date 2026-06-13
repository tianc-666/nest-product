/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, type ReactNode } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, message, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";
import { uploadFile } from "../../action/upload";
import axios from "axios";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CommonUpload: React.FC<{
  type?: "image" | "file";
  value?: string;
  onChange?: (value: string) => void;
  propsUploadBtn?: ReactNode;
}> = ({ type = "image", value, onChange, propsUploadBtn }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>();
  const beforeUpload = (file: FileType) => {
    // 区分type 不同的校验
    if (type === "file") {
      return true;
    }
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const url = "http://localhost:9000/chat-room/" + info.file.name;
      setUrl(url);
      setLoading(false);
      onChange?.(url);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  useEffect(() => {
    if (value) {
      setUrl(value);
    }
  }, [value]);

  return (
    <Flex gap="middle" wrap>
      <Upload
        name="file"
        listType={type === "file" ? "text" : "picture-circle"}
        showUploadList={false}
        action={async (file) => {
          const res = await uploadFile(file);
          return res as any;
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        customRequest={async (option) => {
          const { file, onSuccess, action } = option;
          const res = await axios.put((action as any).data, file);
          onSuccess!(res.data);
        }}
      >
        {type === "image" && url && (
          <img
            draggable={false}
            src={url}
            alt="avatar"
            className="w-24 h-24 rounded-full"
          />
        )}
        {type === "file" && url && (
          <div>
            <div>{url}</div>
          </div>
        )}

        {!url && (propsUploadBtn || uploadButton)}
      </Upload>
    </Flex>
  );
};

export default CommonUpload;
