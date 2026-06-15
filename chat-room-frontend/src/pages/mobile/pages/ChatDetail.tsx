import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';

interface UserInfo {
  id: number;
  nickName: string;
  headPic: string;
}

interface ChatMessage {
  id: number;
  senderId: number;
  content: string;
  type: string;
  sendUserInfo: UserInfo;
  createdAt?: string;
}

type SocketMessage =
  | { type: 'joinRoom'; userId: number }
  | {
      type: 'sendMessage';
      content: string;
      senderId: number;
      sendUserInfo: UserInfo;
      messageType: string;
    };

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#ededed',
    overflow: 'hidden',
  },
  messageArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 16px',
    paddingTop: 60,
    paddingBottom: 12,
    WebkitOverflowScrolling: 'touch',
  },
  timeSeparator: {
    textAlign: 'center' as const,
    margin: '12px 0',
    fontSize: 12,
    color: '#b2b2b2',
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rowSelf: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    flexShrink: 0,
    objectFit: 'cover' as const,
  },
  avatarLeft: {
    marginRight: 8,
  },
  avatarRight: {
    marginLeft: 8,
  },
  bubbleWrapper: {
    maxWidth: '70%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  nickname: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  bubble: {
    padding: '9px 12px',
    borderRadius: 4,
    fontSize: 16,
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
    position: 'relative' as const,
    maxWidth: '100%',
  },
  bubbleSelf: {
    background: '#95ec69',
    color: '#000',
  },
  bubbleOther: {
    background: '#fff',
    color: '#000',
  },
  bubbleArrowSelf: {
    position: 'absolute' as const,
    top: 12,
    right: -6,
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderLeft: '6px solid #95ec69',
  },
  bubbleArrowOther: {
    position: 'absolute' as const,
    top: 12,
    left: -6,
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: '6px solid #fff',
  },
  imageMsg: {
    maxWidth: 180,
    maxHeight: 180,
    borderRadius: 4,
    display: 'block',
  },
  fileMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 0',
    color: '#576b95',
    textDecoration: 'none',
    fontSize: 14,
  },
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    paddingTop: 8,
    paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
    background: '#f7f7f7',
    borderTop: '0.5px solid #e5e5e5',
    gap: 8,
  },
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#e5e5e5',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    color: '#666',
    cursor: 'pointer',
    flexShrink: 0,
  },
  textInput: {
    flex: 1,
    height: 36,
    border: '0.5px solid #e5e5e5',
    borderRadius: 6,
    padding: '0 10px',
    fontSize: 16,
    outline: 'none',
    background: '#fff',
    color: '#000',
  },
  sendBtn: {
    height: 36,
    padding: '0 14px',
    borderRadius: 6,
    background: '#07c160',
    color: '#fff',
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    opacity: 1,
  },
  sendBtnDisabled: {
    opacity: 0.4,
    cursor: 'default',
  },
};

const formatTime = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

const formatDateSeparator = (dateStr: string): string => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const dayMs = 86400000;

  if (diff < dayMs && d.getDate() === now.getDate()) {
    return `今天 ${formatTime(d)}`;
  }
  if (diff < dayMs * 2 && d.getDate() === now.getDate() - 1) {
    return `昨天 ${formatTime(d)}`;
  }
  if (diff < dayMs * 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${weekdays[d.getDay()]}`;
  }
  return `${d.getMonth() + 1}月${d.getDate()}日 ${formatTime(d)}`;
};

const ChatDetail: React.FC = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatRoomName, setChatRoomName] = useState('聊天');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const userInfo: UserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!chatroomId) return;

    axiosInstance
      .get('/chat-history/list', { params: { chatroomId } })
      .then((res) => {
        if (res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.list || [];
          setMessages(list);
        }
      })
      .catch(() => {});
  }, [chatroomId]);

  useEffect(() => {
    if (!chatroomId) return;

    axiosInstance
      .get('/chatroom/user-chatroom')
      .then((res) => {
        const rooms = Array.isArray(res.data) ? res.data : res.data.list || [];
        const room = rooms.find(
          (r: { id: number | string }) => String(r.id) === String(chatroomId)
        );
        if (room?.name) setChatRoomName(room.name);
      })
      .catch(() => {});
  }, [chatroomId]);

  useEffect(() => {
    if (!chatroomId || !userInfo.id) return;

    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', {
        chatroomId: +chatroomId,
        userId: +userInfo.id,
      });
    });

    socket.on('message', (reply: SocketMessage) => {
      if (reply.type === 'sendMessage') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            senderId: reply.senderId,
            content: reply.content,
            type: reply.messageType,
            sendUserInfo: reply.sendUserInfo,
          },
        ]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [chatroomId, userInfo.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || !socketRef.current || !chatroomId) return;

    socketRef.current.emit('sendMessage', {
      chatroomId: +chatroomId,
      message: { content: text, type: 'text' },
      sendUserId: +userInfo.id,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        senderId: +userInfo.id,
        content: text,
        type: '0',
        sendUserInfo: {
          id: +userInfo.id,
          nickName: userInfo.nickName || '',
          headPic: userInfo.headPic || '',
        },
      },
    ]);

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (msg: ChatMessage) => {
    const isSelf = +userInfo.id === +msg.senderId;
    const typeNum = Number(msg.type);
    const msgType = isNaN(typeNum) ? 3 : typeNum;

    return (
      <div
        key={msg.id}
        style={{
          ...styles.row,
          ...(isSelf ? styles.rowSelf : styles.rowOther),
        }}
      >
        {!isSelf && (
          <img
            src={msg.sendUserInfo?.headPic}
            alt=""
            style={{ ...styles.avatar, ...styles.avatarLeft }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%2307c160" width="40" height="40" rx="4"/><text x="50%" y="55%" text-anchor="middle" fill="white" font-size="16" font-family="sans-serif" dominant-baseline="middle">?</text></svg>';
            }}
          />
        )}
        <div style={styles.bubbleWrapper}>
          {!isSelf && (
            <span style={styles.nickname}>
              {msg.sendUserInfo?.nickName}
            </span>
          )}
          <div
            style={{
              ...styles.bubble,
              ...(isSelf ? styles.bubbleSelf : styles.bubbleOther),
            }}
          >
            <div style={isSelf ? styles.bubbleArrowSelf : styles.bubbleArrowOther} />
            {msgType === 1 ? (
              <img src={msg.content} alt="" style={styles.imageMsg} />
            ) : msgType === 2 ? (
              <a href={msg.content} download style={styles.fileMsg}>
                📎 {msg.content.split('/').pop()}
              </a>
            ) : (
              msg.content
            )}
          </div>
        </div>
        {isSelf && (
          <img
            src={msg.sendUserInfo?.headPic}
            alt=""
            style={{ ...styles.avatar, ...styles.avatarRight }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%2395ec69" width="40" height="40" rx="4"/><text x="50%" y="55%" text-anchor="middle" fill="white" font-size="16" font-family="sans-serif" dominant-baseline="middle">?</text></svg>';
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <Header
        title={chatRoomName}
        showBack
        onBack={() => navigate(-1)}
      />

      <div style={styles.messageArea}>
        {messages.length > 0 &&
          messages.map((msg, i) => {
            const showTime =
              i === 0 ||
              (msg.createdAt &&
                messages[i - 1]?.createdAt &&
                new Date(msg.createdAt).getTime() -
                  new Date(messages[i - 1].createdAt!).getTime() >
                  300000);

            return (
              <React.Fragment key={msg.id}>
                {showTime && msg.createdAt && (
                  <div style={styles.timeSeparator}>
                    {formatDateSeparator(msg.createdAt)}
                  </div>
                )}
                {renderMessage(msg)}
              </React.Fragment>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBar}>
        <button style={styles.plusBtn}>+</button>
        <input
          style={styles.textInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="消息"
          enterKeyHint="send"
        />
        <button
          style={{
            ...styles.sendBtn,
            ...(!inputValue.trim() ? styles.sendBtnDisabled : {}),
          }}
          disabled={!inputValue.trim()}
          onClick={handleSend}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
