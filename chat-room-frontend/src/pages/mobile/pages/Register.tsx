import React, { useState } from 'react';
import { Input, message, Upload } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';

const GREEN = '#07c160';

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#ededed' },
  form: { background: '#fff', padding: '16px' },
  title: { fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 16 },
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
    fontWeight: 600,
    cursor: 'pointer',
  },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 14, color: '#999' },
  link: { color: GREEN, textDecoration: 'none' },
  captchaRow: { display: 'flex', gap: 12, alignItems: 'center' },
  captchaBtn: { height: 44, whiteSpace: 'nowrap' as const, flexShrink: 0 },
};

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  nickName: string;
  email: string;
  headPic: string;
  captch: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    password: '',
    confirmPassword: '',
    nickName: '',
    email: '',
    headPic: '',
    captch: '',
  });
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const update = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSendCaptcha = async () => {
    if (!form.email) {
      message.error('请输入邮箱');
      return;
    }
    setCaptchaLoading(true);
    try {
      await axiosInstance.get(`/user/create-captcha?email=${form.email}`);
      message.success('验证码已发送');
    } catch {
      // handled
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.username.trim() || !form.password.trim()) {
      message.warning('请输入用户名和密码');
      return;
    }
    if (form.password !== form.confirmPassword) {
      message.warning('两次密码不一致');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      const res = await axiosInstance.post('/user/register', submitData);
      if (res.data) {
        message.success('注册成功，请登录');
        navigate('/m/login');
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Header title="注册" showBack onBack={() => navigate('/m/login')} />
      <div style={{ paddingTop: 45 }}>
        <div style={styles.form}>
          {/* 头像 */}
          <div style={styles.field}>
            <label style={styles.label}>头像</label>
            <Upload
              showUploadList={false}
              customRequest={async (option) => {
                const { file, onSuccess } = option;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await axiosInstance.get(`/minio/presignedUrl?fileName=${(file as File).name}`);
                  await axiosInstance.put(res.data, file);
                  const url = `${window.location.protocol}//${window.location.hostname}:9000/chat-room/${(file as File).name}`;
                  update('headPic', url);
                  onSuccess?.(url);
                } catch {
                  message.error('上传失败');
                }
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 6,
                border: '1px dashed #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
              }}>
                {form.headPic ? (
                  <img src={form.headPic} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
                )}
              </div>
            </Upload>
          </div>

          {/* 用户名 */}
          <div style={styles.field}>
            <label style={styles.label}>用户名 *</label>
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: '#bbb' }} />}
              placeholder="请输入用户名"
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
            />
          </div>

          {/* 密码 */}
          <div style={styles.field}>
            <label style={styles.label}>密码 *</label>
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: '#bbb' }} />}
              placeholder="请输入密码"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
            />
          </div>

          {/* 确认密码 */}
          <div style={styles.field}>
            <label style={styles.label}>确认密码 *</label>
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: '#bbb' }} />}
              placeholder="请再次输入密码"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
            />
          </div>

          {/* 昵称 */}
          <div style={styles.field}>
            <label style={styles.label}>昵称</label>
            <Input
              size="large"
              prefix={<SmileOutlined style={{ color: '#bbb' }} />}
              placeholder="请输入昵称"
              value={form.nickName}
              onChange={(e) => update('nickName', e.target.value)}
            />
          </div>

          {/* 邮箱 */}
          <div style={styles.field}>
            <label style={styles.label}>邮箱 *</label>
            <Input
              size="large"
              prefix={<MailOutlined style={{ color: '#bbb' }} />}
              placeholder="请输入邮箱"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>

          {/* 验证码 */}
          <div style={styles.field}>
            <label style={styles.label}>验证码</label>
            <div style={styles.captchaRow}>
              <Input
                size="large"
                style={{ flex: 1 }}
                placeholder="请输入验证码"
                value={form.captch}
                onChange={(e) => update('captch', e.target.value)}
              />
              <button
                style={{ ...styles.captchaBtn, height: 44, padding: '0 16px', border: '1px solid #d9d9d9', borderRadius: 6, background: '#fff', cursor: 'pointer' }}
                disabled={captchaLoading}
                onClick={handleSendCaptcha}
              >
                {captchaLoading ? '发送中...' : '获取验证码'}
              </button>
            </div>
          </div>

          <button style={styles.btn} disabled={loading} onClick={handleSubmit}>
            {loading ? '注册中...' : '注册'}
          </button>

          <div style={styles.footer}>
            已有账号？<Link to="/m/login" style={styles.link}>去登录</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
