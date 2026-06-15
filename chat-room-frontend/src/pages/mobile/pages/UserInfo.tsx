import React, { useEffect, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';

interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
}

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
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '0.5px solid #e5e5e5',
    marginBottom: 16,
  },
  avatarLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
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
  field: {
    marginBottom: 16,
  },
};

const MobileUserInfo: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    nickname: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user/info');
        if (res.data) {
          setForm({
            username: res.data.username || '',
            nickname: res.data.nickname || '',
            email: res.data.email || '',
            avatar: res.data.avatar || '',
          });
        }
      } catch {
        // handled by interceptor
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!form.nickname) {
      message.error('请输入昵称');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/user/modify-userinfo', {
        nickname: form.nickname,
        headPic: form.avatar,
      });
      message.success('修改成功');
      navigate('/m/me');
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Header title="个人信息" showBack onBack={() => navigate('/m/me')} />
      <div style={{ paddingTop: 45 }}>
        <div style={styles.form}>
          <div style={styles.avatarWrap}>
            <span style={styles.avatarLabel}>头像</span>
            <Upload
              showUploadList={false}
              customRequest={async (option) => {
                const { file, onSuccess } = option;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await axiosInstance.get(`/minio/presignedUrl?fileName=${(file as File).name}`);
                  await axiosInstance.put(res.data, file);
                  const url = `/minio/chat-room/${(file as File).name}`;
                  setForm((prev) => ({ ...prev, avatar: url }));
                  onSuccess?.(url);
                } catch {
                  message.error('上传失败');
                }
              }}
            >
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 6,
                border: '1px solid #e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {form.avatar ? (
                  <img src={form.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <PlusOutlined style={{ fontSize: 20, color: '#999' }} />
                )}
              </div>
            </Upload>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>用户名</label>
            <input
              style={styles.input}
              value={form.username}
              disabled
              placeholder="不可修改"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>昵称</label>
            <input
              style={styles.input}
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              placeholder="请输入昵称"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>邮箱</label>
            <input
              style={styles.input}
              value={form.email}
              disabled
              placeholder="不可修改"
            />
          </div>

          <Button
            type="primary"
            style={styles.btn}
            loading={loading}
            onClick={handleSubmit}
          >
            修改信息
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileUserInfo;
