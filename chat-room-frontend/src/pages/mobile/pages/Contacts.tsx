import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Input, Spin } from 'antd';
import { UserAddOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';
import TabBar from '../components/TabBar';

interface Friend {
  id: number;
  nickname: string;
  username: string;
  avatar: string;
}

interface Group {
  id: number;
  name: string;
  avatar: string;
  memberCount: number;
}

const GREEN = '#07c160';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#ededed',
    paddingBottom: 60,
  },
  searchWrap: {
    padding: '8px 12px',
    background: '#ededed',
  },
  searchInput: {
    borderRadius: 6,
    height: 36,
    background: '#fff',
  },
  section: {
    marginTop: 8,
  },
  sectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: '#fff',
    cursor: 'pointer',
    borderBottom: '0.5px solid #e5e5e5',
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  sectionArrow: {
    color: '#c8c8c8',
    fontSize: 12,
    flexShrink: 0,
  },
  groupItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: '#fff',
    cursor: 'pointer',
    borderBottom: '0.5px solid #e5e5e5',
  },
  groupName: {
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  groupCount: {
    fontSize: 12,
    color: '#999',
  },
  friendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    background: '#fff',
    cursor: 'pointer',
    borderBottom: '0.5px solid #e5e5e5',
  },
  friendName: {
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 13,
    color: '#999',
  },
  letterBar: {
    fontSize: 13,
    color: '#999',
    padding: '4px 16px',
    background: '#ededed',
  },
  loadingWrap: {
    textAlign: 'center' as const,
    padding: 60,
  },
};

const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsRes, groupsRes, requestsRes] = await Promise.all([
          axiosInstance.get('/friend-ship/list'),
          axiosInstance.get('/chatroom/list', { params: { type: 1 } }),
          axiosInstance.get('/friend-ship/request-list').catch(() => ({ data: [] })),
        ]);
        const friendList = friendsRes.data?.list || (Array.isArray(friendsRes.data) ? friendsRes.data : []);
        setFriends(friendList);
        const groupList = groupsRes.data?.list || (Array.isArray(groupsRes.data) ? groupsRes.data : []);
        setGroups(groupList);
        const requestList = Array.isArray(requestsRes.data) ? requestsRes.data : [];
        setFriendRequestCount(requestList.filter((r: any) => r.status === 0).length);
      } catch {
        // error handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFriends = searchText
    ? friends.filter(
        (f) =>
          f.nickname?.includes(searchText) ||
          f.username?.includes(searchText),
      )
    : friends;

  const grouped = filteredFriends.reduce<Record<string, Friend[]>>((acc, f) => {
    const letter = (f.nickname?.[0] || '?').toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(f);
    return acc;
  }, {});
  const sortedLetters = Object.keys(grouped).sort();

  if (loading) {
    return (
      <div style={styles.page}>
        <Header title="通讯录" />
        <div style={styles.loadingWrap}>
          <Spin />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header title="通讯录" />

      <div style={{ paddingTop: 45, paddingBottom: 56 }}>
        <div style={styles.searchWrap}>
          <Input
            style={styles.searchInput}
            placeholder="搜索"
            prefix={<span style={{ color: '#bbb' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <div style={styles.section}>
          <div
            style={styles.sectionItem}
            onClick={() => navigate('/m/contacts/add-friend')}
          >
            <div style={{ ...styles.sectionIcon, background: GREEN, color: '#fff' }}>
              <UserAddOutlined />
            </div>
            <span style={styles.sectionLabel}>添加好友</span>
            <span style={styles.sectionArrow}>&#8250;</span>
          </div>

          <div
            style={styles.sectionItem}
            onClick={() => navigate('/m/contacts/friend-requests')}
          >
            <div style={{ ...styles.sectionIcon, background: GREEN, color: '#fff' }}>
              <UserAddOutlined />
            </div>
            <span style={styles.sectionLabel}>新的朋友</span>
            {friendRequestCount > 0 && (
              <Badge count={friendRequestCount} style={{ marginRight: 4 }} />
            )}
            <span style={styles.sectionArrow}>&#8250;</span>
          </div>

          <div
            style={styles.sectionItem}
            onClick={() => navigate('/m/contacts/groups')}
          >
            <div style={{ ...styles.sectionIcon, background: GREEN, color: '#fff' }}>
              <TeamOutlined />
            </div>
            <span style={styles.sectionLabel}>群聊</span>
            {groups.length > 0 && (
              <span style={{ color: '#999', fontSize: 13, marginRight: 4 }}>
                {groups.length}
              </span>
            )}
            <span style={styles.sectionArrow}>&#8250;</span>
          </div>
        </div>

        {groups.length > 0 && (
          <div style={styles.section}>
            {groups.map((group) => (
              <div
                key={group.id}
                style={styles.groupItem}
                onClick={() => navigate(`/m/chat/${group.id}`)}
              >
                <Avatar
                  size={40}
                  src={group.avatar}
                  style={{ background: GREEN, flexShrink: 0, borderRadius: 6 }}
                >
                  {group.name?.charAt(0)}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.groupName}>{group.name}</div>
                  <div style={styles.groupCount}>{group.memberCount || 0} 人</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedLetters.map((letter) => (
          <div key={letter} style={styles.section}>
            <div style={styles.letterBar}>{letter}</div>
            {grouped[letter].map((friend) => (
              <div
                key={friend.id}
                style={styles.friendItem}
                onClick={() => navigate(`/m/contacts/detail/${friend.id}`)}
              >
                <Avatar
                  size={40}
                  src={friend.avatar}
                  style={{ background: GREEN, flexShrink: 0 }}
                >
                  {friend.nickname?.charAt(0)}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.friendName}>{friend.nickname}</div>
                  {friend.username && (
                    <div style={styles.friendUsername}>{friend.username}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {!loading && filteredFriends.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
            暂无联系人
          </div>
        )}
      </div>

      <TabBar activeKey="contacts" onChange={(key) => navigate(`/m/${key}`)} />
    </div>
  );
};

export default Contacts;
