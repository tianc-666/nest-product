/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRequest } from "ahooks";
import { Button, message, Space, Table, Tabs, type TabsProps } from "antd";
import { friendsService } from "../../action/friends";
import { useState } from "react";
import { FRIEND_STATUS } from "./conts";

const Message = () => {
  const [fromMeList, setFromMeList] = useState([]);
  const [fromOthersList, setFromOthersList] = useState([]);
  const [key, setKey] = useState("fromMe");
  const { run: getFriendRequestList } = useRequest(
    friendsService.getFriendRequestList,
    {
      manual: false,
      onSuccess: (res) => {
        setFromOthersList(res.data.toMe || []);
        setFromMeList(res.data.fromMe || []);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const agreeFriendRequest = async (friendId: number) => {
    const res = await friendsService.agreeFriendRequest({ friendId });
    if (res) {
      message.success("同意好友请求成功");
      getFriendRequestList();
    }
  };
  const rejectFriendRequest = async (friendId: number) => {
    const res = await friendsService.rejectFriendRequest({ friendId });
    if (res) {
      message.success("拒绝好友请求成功");
      getFriendRequestList();
    }
  };

  const columns = [
    {
      title: "用户",
      render: (_: any, record: Record<string, any>) => {
        return record?.fromUser?.nickName || record?.toUser?.nickName;
      },
    },
    {
      title: "请求理由",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "请求时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      render: (_: any, record: Record<string, any>) => {
        return record.fromUser ? (
          <Space>
            <Button
              type="primary"
              onClick={() => agreeFriendRequest(record.fromUserId)}
            >
              接受
            </Button>
            <Button
              type="default"
              onClick={() => rejectFriendRequest(record.fromUserId)}
            >
              拒绝
            </Button>
          </Space>
        ) : (
          <div>
            {FRIEND_STATUS[record.status as keyof typeof FRIEND_STATUS]}
          </div>
        );
      },
    },
  ];

  const itemContent = (type: "fromMe" | "fromOthers") => {
    return (
      <Table
        columns={columns}
        dataSource={type === "fromMe" ? fromMeList : fromOthersList}
      />
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "fromMe",
      label: "我发出的",
      children: itemContent("fromMe"),
    },
    {
      key: "fromOthers",
      label: "来自他人的",
      children: itemContent("fromOthers"),
    },
  ];
  const onChange = (key: string) => {
    setKey(key);
  };

  return (
    <div>
      <Tabs accessKey={key} items={items} onChange={onChange} />
    </div>
  );
};

export default Message;
