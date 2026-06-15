import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';

const GREEN = '#07c160';

interface Group {
  id: number;
  name: string;
  avatar: string;
  memberCount: number;
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#ededed' },
  list: { background: '#fff' },
  item: {
    padding: '12px 16px',
    borderBottom: '0.5px solid #e5e5e5',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 16, color: '#000' },
  count: { fontSize: 12, color: '#999', marginTop: 2 },
  empty: { textAlign: 'center', color: '#999', padding: 60 },
};

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axiosInstance.get('/chatroom/list?type=1');
        setGroups(Array.isArray(res.data) ? res.data : res.data.list || []);
      } catch {
        // handled
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div style={styles.page}>
      <Header title="群聊" showBack onBack={() => navigate('/m/contacts')} />
      <div style={{ paddingTop: 45, paddingBottom: 20 }}>
        {loading ? (
          <div style={styles.empty}>加载中...</div>
        ) : groups.length === 0 ? (
          <div style={styles.empty}>暂无群聊</div>
        ) : (
          <div style={styles.list}>
            {groups.map((group) => (
              <div
                key={group.id}
                style={styles.item}
                onClick={() => navigate(`/m/chat/${group.id}`)}
              >
                <Avatar
                  size={48}
                  src={group.avatar}
                  style={{ background: GREEN, flexShrink: 0, borderRadius: 6 }}
                >
                  {group.name?.charAt(0)}
                </Avatar>
                <div style={styles.info}>
                  <div style={styles.name}>{group.name}</div>
                  <div style={styles.count}>{group.memberCount || 0} 人</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
