/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRequest } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { chatRoomAction } from "../../action/chatroom";
import { Button, Empty, Image, message, Popover } from "antd";
import TextArea from "antd/es/input/TextArea";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import AddChatRoomUser from "./AddChatRoomUser";
import { groupChatAction } from "../../action/groupChat";
import EmojiPicker from "emoji-picker-react";
import UploadModal from "./UploadModal";
import { MESSAGE_TYPE_TEXT } from "./conts";
import { FileOutlined, FolderOutlined } from "@ant-design/icons";
import { favoriteAction } from "../../action/favorite";

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}

type ReplyType =
  | {
      type: "joinRoom";
      userId: number;
    }
  | {
      type: "sendMessage";
      content: string;
      senderId: number;
      sendUserInfo: {
        headPic: string;
        nickName: string;
      };
      messageType: string;
    };

const ChatContent = () => {
  const [messageList, setMessage] = useState<any[]>([]);
  const [showAddChatRoomUser, setShowAddChatRoomUser] = useState(false);
  const [showUploadParam, setShowUploadParam] = useState<{
    visible: boolean;
    type: "image" | "file";
  }>({
    visible: false,
    type: "file",
  });
  const selectChartId = useParams().chatroomId;
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const socketRef = useRef<any>(null);
  const [value, setValue] = useState("");

  // 获取房间历史消息
  const { run } = useRequest(chatRoomAction.getChatRoomHistory, {
    onSuccess: (res) => {
      setMessage(res.data);
    },
    manual: true,
  });

  const favoriteClick = async (chatHistoryId: number) => {
    const res = await favoriteAction.favoriteChatHistory({
      chatHistoryId,
    });
    if (res) {
      message.success("收藏成功");
    }
  };
  useEffect(() => {
    if (selectChartId) {
      run({ chatroomId: selectChartId });
    }
  }, [selectChartId, run]);

  useEffect(() => {
    if (!selectChartId) {
      return;
    }
    const socket = (socketRef.current = io("http://localhost:3000"));
    socket.on("connect", function () {
      const payload: JoinRoomPayload = {
        chatroomId: +selectChartId,
        userId: +userInfo.id,
      };

      socket.emit("joinRoom", payload);

      socket.on("message", (reply: ReplyType) => {
        if (reply.type === "joinRoom") {
          message.success(`用户${reply.userId}加入了房间`);
        } else if (reply.type === "sendMessage") {
          setMessage((prev) => [
            ...prev,
            {
              ...reply,
              type: MESSAGE_TYPE_TEXT[
                reply.messageType as keyof typeof MESSAGE_TYPE_TEXT
              ],
            },
          ]);
        }
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [selectChartId]);

  return (
    <div className="h-[calc(100vh-72px)] relative px-4">
      <div className="h-[calc(100vh-72px-150px)] overflow-auto">
        {messageList.length > 0 ? (
          messageList?.map((item) => (
            <div
              key={item.id}
              className={`w-fit mb-2 relative ${
                +userInfo.id !== +item.senderId ? "ml-auto" : ""
              }`}
            >
              <div className={`flex items-center`}>
                <img
                  className="w-8 h-8 rounded-full"
                  src={item.sendUserInfo.headPic}
                />
                <span>{item.sendUserInfo.nickName}</span>
              </div>
              <div
                className={`ml-12 border border-gray-300 rounded px-2 py-1 w-fit ${
                  +userInfo.id === +item.senderId
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {item.type === 1 ? (
                  <Image
                    src={item.content}
                    alt=""
                    className="w-32 h-32 rounded"
                    style={{ maxWidth: 200, maxHeight: 200 }}
                  />
                ) : item.type === 2 ? (
                  <a href={item.content} download>
                    <FileOutlined /> {item.content}
                  </a>
                ) : (
                  item.content
                )}
              </div>

              <div
                className="absolute top-0 right-0 cursor-pointer"
                onClick={() => favoriteClick(item.id)}
              >
                <FolderOutlined />
              </div>
            </div>
          ))
        ) : (
          <Empty />
        )}
        <div id="bottom-bar" key="bottom-bar" className="h-1"></div>
      </div>

      {selectChartId && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-white">
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center gap-2">
              <Popover
                trigger={"click"}
                title={"选择表情"}
                content={
                  <div>
                    <EmojiPicker
                      onEmojiClick={(emojiValue) => {
                        setValue(value + emojiValue.emoji);
                      }}
                    />
                  </div>
                }
              >
                <div className="cursor-pointer">表情</div>
              </Popover>
              <span
                onClick={() =>
                  setShowUploadParam({
                    type: "image",
                    visible: true,
                  })
                }
              >
                图片
              </span>
              <span
                onClick={() =>
                  setShowUploadParam({
                    type: "file",
                    visible: true,
                  })
                }
              >
                文件
              </span>
            </div>
            <Button type="primary" onClick={() => setShowAddChatRoomUser(true)}>
              添加用户
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              type="primary"
              onClick={() => {
                socketRef.current.emit("sendMessage", {
                  chatroomId: +selectChartId,
                  message: {
                    content: value,
                    type: "text",
                  },
                  sendUserId: +userInfo.id,
                });

                setValue("");
                setTimeout(() => {
                  document
                    .getElementById("bottom-bar")
                    ?.scrollIntoView({ block: "end" });
                }, 300);
              }}
            >
              发送
            </Button>
          </div>
        </div>
      )}
      {showUploadParam.visible && (
        <UploadModal
          type={showUploadParam.type}
          visible={showUploadParam.visible}
          onCancel={() =>
            setShowUploadParam({ ...showUploadParam, visible: false })
          }
          onOk={(url) => {
            socketRef.current.emit("sendMessage", {
              chatroomId: +selectChartId!,
              message: {
                content: url,
                type: showUploadParam.type,
              },
              sendUserId: +userInfo.id,
            });
            setShowUploadParam({ ...showUploadParam, visible: false });
            setTimeout(() => {
              document
                .getElementById("bottom-bar")
                ?.scrollIntoView({ block: "end" });
            }, 300);
            message.success("上传成功");
          }}
        />
      )}
      {showAddChatRoomUser && (
        <AddChatRoomUser
          open={showAddChatRoomUser}
          onCancel={() => setShowAddChatRoomUser(false)}
          onOk={async (values) => {
            const res = await groupChatAction.addUserToGroupChat({
              chatroomId: +selectChartId!,
              friendNames: values.friendNames,
            });
            if (res) {
              message.success("添加成功");
            }
            setShowAddChatRoomUser(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatContent;
