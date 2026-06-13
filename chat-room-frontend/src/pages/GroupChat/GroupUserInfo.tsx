import { Image, Modal, Table } from "antd";
import type { GroupChatListProps } from ".";
import { useState } from "react";
import { useRequest } from "ahooks";
import { groupChatAction } from "../../action/groupChat";

interface GroupUserInfoProps {
  open: boolean;
  onCancel: () => void;
  curId: GroupChatListProps["id"];
}
const GroupUserInfo = ({ open, onCancel, curId }: GroupUserInfoProps) => {
  const [userInfoList, setUserInfoList] = useState([]);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "昵称",
      dataIndex: "nickName",
      key: "nickName",
    },
    {
      title: "头像",
      dataIndex: "headPic",
      key: "headPic",
      render: (headPic: string) => (
        <Image src={headPic} alt="头像" style={{ width: 40, height: 40 }} />
      ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
  ];
  useRequest(groupChatAction.getGroupChatUserInfo, {
    onSuccess: (res) => {
      setUserInfoList(res.data || []);
    },
    defaultParams: [curId],
    refreshDeps: [curId],
  });
  return (
    <Modal title="群成员详情" open={open} onCancel={onCancel} footer={null}>
      <Table columns={columns} dataSource={userInfoList} />
    </Modal>
  );
};

export default GroupUserInfo;
