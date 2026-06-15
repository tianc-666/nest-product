import React from 'react';
import { MessageOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

export type TabKey = 'message' | 'contacts' | 'me';

export interface TabBarProps {
  activeKey: TabKey;
  onChange?: (key: TabKey) => void;
}

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  { key: 'message', label: '消息', icon: <MessageOutlined /> },
  { key: 'contacts', label: '通讯录', icon: <TeamOutlined /> },
  { key: 'me', label: '我', icon: <UserOutlined /> },
];

const GREEN = '#07c160';
const GRAY = '#999';

const styles: Record<string, React.CSSProperties> = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    background: '#f7f7f7',
    borderTop: '1px solid #e5e5e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1000,
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    cursor: 'pointer',
    userSelect: 'none',
    color: GRAY,
    fontSize: 10,
    lineHeight: 1,
    transition: 'color .2s',
  },
  active: {
    color: GREEN,
  },
  icon: {
    fontSize: 20,
  },
};

const TabBar: React.FC<TabBarProps> = ({ activeKey, onChange }) => {
  return (
    <div style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <div
            key={tab.key}
            style={{ ...styles.tab, ...(isActive ? styles.active : undefined) }}
            onClick={() => onChange?.(tab.key)}
          >
            <span style={styles.icon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TabBar;
