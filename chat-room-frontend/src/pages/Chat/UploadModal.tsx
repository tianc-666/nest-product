import { Modal } from "antd";
import CommonUpload from "../../components/CommonUpload";
import { useState } from "react";

interface UploadModalProps {
  type: "image" | "file";
  visible: boolean;
  onCancel: () => void;
  onOk: (url: string) => void;
}
const UploadModal = ({ visible, onCancel, onOk, type }: UploadModalProps) => {
  const [url, setUrl] = useState<string>();
  return (
    <Modal
      title={`上传${type === "image" ? "图片" : "文件"}`}
      open={visible}
      onCancel={onCancel}
      onOk={() => onOk(url || "")}
    >
      <CommonUpload
        type={type}
        onChange={(url) => {
          setUrl(url);
        }}
      />
    </Modal>
  );
};

export default UploadModal;
