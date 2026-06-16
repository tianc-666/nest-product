import React, { useEffect, useState } from 'react';
import { List, Avatar, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';
import TabBar from '../components/TabBar';

interface ChatRoom {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#ededed',
  },
  searchIcon: {
    fontSize: 18,
    color: '#000',
    cursor: 'pointer',
  },
  list: {
    background: '#fff',
  },
  item: {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '0.5px solid #e5e5e5',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 400,
    color: '#000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  time: {
    fontSize: 11,
    color: '#b2b2b2',
    flexShrink: 0,
    marginLeft: 8,
  },
  lastMsg: {
    fontSize: 13,
    color: '#b2b2b2',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    background: '#f44',
    color: '#fff',
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5px',
    flexShrink: 0,
  },
};

const MessageList: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axiosInstance.get('/chatroom/user-chatroom');
        if (res.data) {
          setRooms(Array.isArray(res.data) ? res.data : res.data.list || []);
        }
      } catch {
        // error handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const formatTime = (time?: string) => {
    if (!time) return '';
    const d = new Date(time);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const filteredRooms = rooms.filter((room) =>
    room.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <Header
        title="消息"
        right={<SearchOutlined style={styles.searchIcon} onClick={() => setShowSearch(!showSearch)} />}
      />
      {showSearch && (
        <div style={{ background: '#fff', padding: '8px 12px' }}>
          <input
            style={{ width: '100%', height: 36, border: '1px solid #e5e5e5', borderRadius: 6, padding: '0 12px', fontSize: 14, outline: 'none' }}
            placeholder="搜索聊天"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
          />
        </div>
      )}
      <div style={{ paddingTop: 45, paddingBottom: 56 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin />
          </div>
        ) : (
          <List
            style={styles.list}
            dataSource={filteredRooms}
            renderItem={(room) => (
              <div
                style={styles.item}
                onClick={() => navigate(`/m/chat/${room.id}`)}
              >
                <Avatar
                  size={48}
                  src={room.avatar}
                  style={{ background: '#07c160', flexShrink: 0 }}
                >
                  {room.name?.charAt(0)}
                </Avatar>
                <div style={styles.info}>
                  <div style={styles.nameRow}>
                    <span style={styles.name}>{room.name}</span>
                    <span style={styles.time}>{formatTime(room.lastMessageTime)}</span>
                  </div>
                  <div style={styles.lastMsg}>{room.lastMessage || ''}</div>
                </div>
                {room.unreadCount ? (
                  <div style={styles.badge}>
                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                  </div>
                ) : null}
              </div>
            )}
          />
        )}
      </div>
      <TabBar activeKey="message" onChange={(key) => navigate(`/m/${key}`)} />
    </div>
  );
};

export default MessageList;
