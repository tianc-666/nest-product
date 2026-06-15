import React from 'react';
import { LeftOutlined } from '@ant-design/icons';

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 999,
    background: '#ededed',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    borderBottom: '1px solid #e5e5e5',
  },
  left: {
    width: 60,
    display: 'flex',
    alignItems: 'center',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#000',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontSize: 16,
    padding: 0,
  },
  title: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#000',
    fontSize: 17,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  right: {
    width: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
};

const Header: React.FC<HeaderProps> = ({ title, showBack = false, onBack, right }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        {showBack && (
          <button style={styles.backBtn} onClick={onBack}>
            <LeftOutlined />
            <span>返回</span>
          </button>
        )}
      </div>
      <div style={styles.title}>{title}</div>
      <div style={styles.right}>{right}</div>
    </div>
  );
};

export default Header;
