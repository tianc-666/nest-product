import React, { useState } from 'react';
import { Input, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined } from '@ant-design/icons';
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

interface RegisterForm {
  username: string;
  password: string;
  nickName: string;
  email: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    password: '',
    nickName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.username.trim() || !form.password.trim()) {
      message.warning('请输入用户名和密码');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/user/register', form);
      if (res.data) {
        message.success('注册成功，请登录');
        navigate('/m/login');
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
        <div style={styles.title}>注册</div>
        <div style={styles.field}>
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: '#bbb' }} />}
            placeholder="请输入用户名"
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: '#bbb' }} />}
            placeholder="请输入密码"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <Input
            size="large"
            prefix={<SmileOutlined style={{ color: '#bbb' }} />}
            placeholder="请输入昵称"
            value={form.nickName}
            onChange={(e) => update('nickName', e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <Input
            size="large"
            prefix={<MailOutlined style={{ color: '#bbb' }} />}
            placeholder="请输入邮箱"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            onPressEnter={handleSubmit}
          />
        </div>
        <button
          style={styles.submitBtn}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? '注册中...' : '注册'}
        </button>
        <div style={styles.footer}>
          已有账号？<Link to="/m/login" style={styles.link}>去登录</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
