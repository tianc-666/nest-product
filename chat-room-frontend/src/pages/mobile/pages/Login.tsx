import React, { useState } from 'react';
import { Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';

const GREEN = '#07c160';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#ededed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 32px',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    background: '#fff',
    borderRadius: 8,
    padding: '40px 24px 32px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 600,
    color: '#000',
    marginBottom: 36,
  },
  field: {
    marginBottom: 20,
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    color: '#999',
  },
  link: {
    color: GREEN,
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    height: 44,
    background: GREEN,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      message.warning('请输入用户名和密码');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/user/login', { username, password });
      if (res.data) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user) {
          localStorage.setItem('userInfo', JSON.stringify(res.data.user));
        }
        message.success('登录成功');
        navigate('/m/');
      }
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>微信登录</div>
        <div style={styles.field}>
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: '#bbb' }} />}
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={handleSubmit}
          />
        </div>
        <div style={styles.field}>
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: '#bbb' }} />}
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleSubmit}
          />
        </div>
        <button
          style={styles.submitBtn}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? '登录中...' : '登录'}
        </button>
        <div style={styles.footer}>
          还没有账号？<Link to="/m/register" style={styles.link}>去注册</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
