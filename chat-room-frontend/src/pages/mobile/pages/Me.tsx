import React, { useEffect, useState } from 'react';
import { Avatar, Spin, Modal } from 'antd';
import {
  LockOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import Header from '../components/Header';
import TabBar from '../components/TabBar';

interface UserInfo {
  id: number;
  nickname: string;
  username: string;
  avatar: string;
  signature?: string;
}

const GREEN = '#07c160';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#ededed',
    paddingBottom: 60,
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '20px 16px',
    background: '#fff',
    marginBottom: 8,
    cursor: 'pointer',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 500,
    color: '#000',
    marginBottom: 4,
  },
  username: {
    fontSize: 13,
    color: '#999',
  },
  signature: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  menuGroup: {
    background: '#fff',
    marginBottom: 8,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderBottom: '0.5px solid #e5e5e5',
    cursor: 'pointer',
  },
  lastMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    cursor: 'pointer',
  },
  menuIcon: {
    width: 24,
    fontSize: 18,
    color: GREEN,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  menuArrow: {
    color: '#c8c8c8',
    fontSize: 12,
    flexShrink: 0,
  },
  dangerLabel: {
    fontSize: 16,
    color: '#f44',
    flex: 1,
  },
  loadingWrap: {
    textAlign: 'center' as const,
    padding: 60,
  },
};

interface MenuItemConfig {
  key: string;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}

const Me: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get('/user/info');
        if (res.data) {
          setUserInfo(res.data);
          localStorage.setItem('userInfo', JSON.stringify(res.data));
        }
      } catch {
        // fallback to cached
        try {
          const cached = localStorage.getItem('userInfo');
          if (cached) setUserInfo(JSON.parse(cached));
        } catch {
          // ignore
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      okText: '退出',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/m/login');
      },
    });
  };

  const menuItems: MenuItemConfig[] = [
    {
      key: 'info',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/m/me/info'),
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: '修改密码',
      onClick: () => navigate('/m/me/password'),
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: '关于我们',
    },
  ];

  const dangerItems: MenuItemConfig[] = [
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#f44' }} />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (loading) {
    return (
      <div style={styles.page}>
        <Header title="我" />
        <div style={styles.loadingWrap}>
          <Spin />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header title="我" />

      <div style={{ paddingTop: 45, paddingBottom: 56 }}>
        <div style={styles.userCard} onClick={() => navigate('/m/me/info')}>
          <Avatar
            size={56}
            src={userInfo?.avatar}
            style={{ background: GREEN, flexShrink: 0 }}
          >
            {userInfo?.nickname?.charAt(0) || <UserOutlined />}
          </Avatar>
          <div style={styles.userInfo}>
            <div style={styles.nickname}>{userInfo?.nickname || '未设置昵称'}</div>
            <div style={styles.username}>用户名: {userInfo?.username || '-'}</div>
            {userInfo?.signature && (
              <div style={styles.signature}>{userInfo.signature}</div>
            )}
          </div>
          <span style={styles.menuArrow}>&#8250;</span>
        </div>

        <div style={styles.menuGroup}>
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1 && dangerItems.length === 0;
            return (
              <div
                key={item.key}
                style={isLast ? styles.lastMenuItem : styles.menuItem}
                onClick={item.onClick}
              >
                <span style={styles.menuIcon}>{item.icon}</span>
                <span style={styles.menuLabel}>{item.label}</span>
                <span style={styles.menuArrow}>&#8250;</span>
              </div>
            );
          })}
        </div>

        <div style={styles.menuGroup}>
          {dangerItems.map((item, index) => {
            const isLast = index === dangerItems.length - 1;
            return (
              <div
                key={item.key}
                style={isLast ? styles.lastMenuItem : styles.menuItem}
                onClick={item.onClick}
              >
                <span style={styles.menuIcon}>{item.icon}</span>
                <span style={item.danger ? styles.dangerLabel : styles.menuLabel}>
                  {item.label}
                </span>
                <span style={styles.menuArrow}>&#8250;</span>
              </div>
            );
          })}
        </div>
      </div>

      <TabBar activeKey="me" onChange={(key) => navigate(`/m/${key}`)} />
    </div>
  );
};

export default Me;
