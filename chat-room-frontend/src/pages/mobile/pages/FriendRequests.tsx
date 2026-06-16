import React, { useEffect, useState } from 'react';
import { Avatar, Button, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';

const GREEN = '#07c160';

interface FriendRequest {
  id: number;
  fromUserId: number;
  username: string;
  nickname: string;
  avatar: string;
  reason: string;
  status: number;
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
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 16, color: '#000', marginBottom: 4 },
  reason: { fontSize: 13, color: '#999' },
  empty: { textAlign: 'center', color: '#999', padding: 60 },
};

const FriendRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/friend-ship/request-list');
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAgree = async (id: number) => {
    try {
      await axiosInstance.post('/friend-ship/agree', { friendId: id });
      message.success('已同意');
      fetchRequests();
    } catch { /* */ }
  };

  const handleReject = async (id: number) => {
    try {
      await axiosInstance.post('/friend-ship/reject', { friendId: id });
      message.success('已拒绝');
      fetchRequests();
    } catch { /* */ }
  };

  return (
    <div style={styles.page}>
      <Header title="新的朋友" showBack onBack={() => navigate('/m/contacts')} />
      <div style={{ paddingTop: 45, paddingBottom: 20 }}>
        {loading ? (
          <div style={styles.empty}>加载中...</div>
        ) : requests.length === 0 ? (
          <div style={styles.empty}>暂无好友请求</div>
        ) : (
          <div style={styles.list}>
            {requests.map((req) => (
              <div key={req.id} style={styles.item}>
                <Avatar size={48} src={req.avatar} style={{ background: GREEN, flexShrink: 0 }}>
                  {req.nickname?.charAt(0)}
                </Avatar>
                <div style={styles.info}>
                  <div style={styles.name}>{req.nickname || req.username}</div>
                  {req.reason && <div style={styles.reason}>{req.reason}</div>}
                </div>
                {req.status === 0 ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="small" icon={<CloseOutlined />} onClick={() => handleReject(req.id)}>拒绝</Button>
                    <Button size="small" type="primary" style={{ background: GREEN }} icon={<CheckOutlined />} onClick={() => handleAgree(req.id)}>同意</Button>
                  </div>
                ) : (
                  <span style={{ color: '#999', fontSize: 13 }}>{req.status === 1 ? '已同意' : '已拒绝'}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
