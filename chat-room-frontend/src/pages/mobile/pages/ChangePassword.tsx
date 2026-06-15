import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';

const GREEN = '#07c160';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#ededed',
  },
  form: {
    background: '#fff',
    padding: '16px',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    display: 'block',
  },
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
  field: {
    marginBottom: 16,
  },
  btn: {
    width: '100%',
    height: 44,
    background: GREEN,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    marginTop: 24,
  },
  captchaRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  captchaBtn: {
    height: 44,
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
};

const MobileChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    captcha: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSendCaptcha = async () => {
    if (!form.email) {
      message.error('请输入邮箱');
      return;
    }
    setCaptchaLoading(true);
    try {
      await axiosInstance.get(`/user/modify-password-captch?email=${form.email}`);
      message.success('验证码已发送');
    } catch {
      // handled by interceptor
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.email || !form.captcha || !form.newPassword) {
      message.error('请填写完整信息');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      message.error('两次密码不一致');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/user/modify-password', {
        email: form.email,
        captcha: form.captcha,
        newPassword: form.newPassword,
      });
      message.success('修改成功，请重新登录');
      localStorage.removeItem('token');
      navigate('/m/login');
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Header title="修改密码" showBack onBack={() => navigate('/m/me')} />
      <div style={{ paddingTop: 45 }}>
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>邮箱</label>
            <input
              style={styles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="请输入注册邮箱"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>验证码</label>
            <div style={styles.captchaRow}>
              <input
                style={{ ...styles.input, flex: 1 }}
                value={form.captcha}
                onChange={(e) => setForm({ ...form, captcha: e.target.value })}
                placeholder="请输入验证码"
              />
              <Button
                style={styles.captchaBtn}
                loading={captchaLoading}
                onClick={handleSendCaptcha}
              >
                发送验证码
              </Button>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>新密码</label>
            <input
              style={styles.input}
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="请输入新密码"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>确认密码</label>
            <input
              style={styles.input}
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="请再次输入新密码"
            />
          </div>

          <Button
            type="primary"
            style={styles.btn}
            loading={loading}
            onClick={handleSubmit}
          >
            修改密码
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileChangePassword;
