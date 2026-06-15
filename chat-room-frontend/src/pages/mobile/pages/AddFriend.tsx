import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';

const GREEN = '#07c160';

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#ededed' },
  searchBox: { background: '#fff', padding: '16px' },
  input: {
    width: '100%',
    height: 44,
    border: '1px solid #e5e5e5',
    borderRadius: 6,
    padding: '0 12px',
    fontSize: 15,
    outline: 'none',
  },
  btn: {
    width: '100%',
    height: 44,
    background: GREEN,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    marginTop: 16,
  },
  result: { background: '#fff', marginTop: 12, padding: '16px' },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0',
    borderBottom: '0.5px solid #e5e5e5',
  },
};

const AddFriend: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!username.trim()) {
      message.error('请输入用户名');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/user/find?username=${username}`);
      setResult(res.data);
    } catch {
      message.error('用户不存在');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (userId: number) => {
    try {
      await axiosInstance.post('/friend-ship/add', { userId, reason: '' });
      message.success('已发送好友请求');
      setResult(null);
      setUsername('');
    } catch {
      // handled
    }
  };

  return (
    <div style={styles.page}>
      <Header title="添加好友" showBack onBack={() => navigate('/m/contacts')} />
      <div style={{ paddingTop: 45 }}>
        <div style={styles.searchBox}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              style={{ ...styles.input, flex: 1 }}
              placeholder="输入用户名搜索"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button
              style={{ height: 44, background: GREEN, color: '#fff', border: 'none' }}
              icon={<SearchOutlined />}
              loading={loading}
              onClick={handleSearch}
            >
              搜索
            </Button>
          </div>
        </div>

        {result && (
          <div style={styles.result}>
            <div style={styles.resultItem}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, color: '#000' }}>{result.nickname || result.username}</div>
                <div style={{ fontSize: 13, color: '#999' }}>用户名: {result.username}</div>
              </div>
              <Button
                type="primary"
                style={{ background: GREEN, border: 'none' }}
                onClick={() => handleAdd(result.id)}
              >
                添加好友
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFriend;
