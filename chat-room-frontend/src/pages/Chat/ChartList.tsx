import { useRequest } from "ahooks";
import { useState } from "react";
import { groupChatAction } from "../../action/groupChat";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { message, Popconfirm } from "antd";

const ChartList = () => {
  const [chatList, setChatList] = useState<{ id: string; name: string }[]>([
    {
      id: "1",
      name: "聊天1",
    },
    {
      id: "2",
      name: "聊天2",
    },
  ]);
  const navigate = useNavigate();
  const selectChartId = useParams().chatroomId!;

  const { run: getChatRoomList } = useRequest(
    groupChatAction.getUserChatRoomList,
    {
      onSuccess: (res) => {
        setChatList(res.data);
      },
    }
  );
  return (
    <>
      {chatList.map((item) => (
        <div
          className={`flex justify-between p-2 cursor-pointer border border-gray-300 whitespace-nowrap overflow-hidden text-ellipsis ${
            +selectChartId === +item.id ? "bg-gray-300" : ""
          }`}
          key={item.id}
          onClick={() => {
            navigate(`/chat/${item.id}`);
          }}
        >
          {item.name}
          <Popconfirm
            title="确认退出吗？"
            onConfirm={async () => {
              const res = await groupChatAction.outGroupChat(+item.id);
              if (res) {
                getChatRoomList();
                message.success("退出成功");
              }
            }}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </div>
      ))}
    </>
  );
};

export default ChartList;
