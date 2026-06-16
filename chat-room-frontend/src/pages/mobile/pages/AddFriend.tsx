import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';

const GREEN = '#07c160';

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#ededed' },
  form: { background: '#fff', padding: '16px' },
  input: {
    width: '100%',
    height: 44,
    border: '1px solid #e5e5e5',
    borderRadius: 6,
    padding: '0 12px',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  field: { marginBottom: 16 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, display: 'block' },
  btn: {
    width: '100%',
    height: 44,
    background: GREEN,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
  },
};

const AddFriend: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    reason: '',
  });

  const handleAdd = async () => {
    if (!form.username.trim()) {
      message.error('请输入用户名');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/friend-ship/add', {
        username: form.username,
        reason: form.reason,
      });
      message.success('已发送好友请求');
      setForm({ username: '', reason: '' });
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Header title="添加好友" showBack onBack={() => navigate('/m/contacts')} />
      <div style={{ paddingTop: 45 }}>
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>用户名</label>
            <Input
              style={styles.input}
              placeholder="请输入好友用户名"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              prefix={<UserAddOutlined style={{ color: '#bbb' }} />}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>验证消息（可选）</label>
            <Input
              style={styles.input}
              placeholder="请输入验证消息"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>

          <Button
            type="primary"
            style={styles.btn}
            loading={loading}
            onClick={handleAdd}
          >
            添加好友
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
