// components/RightSidebar.tsx
import React from 'react';
import CalendarWithIcons from '../Calender/Calender';  // Calendarコンポーネントのインポート
import { EntrySports } from '../type';  // EntrySports型のインポート
import styles from './RightSidebar.module.css';  // スタイルのインポート
import CardSports  from '../Card/CardSports';

interface RightSidebarProps {
  sportsEntries: EntrySports[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ sportsEntries }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles['sidebar-header']}>
        <h3>Right Sidebar</h3>
      </div>
      <div className={styles['calendar-container']}>
        <CalendarWithIcons sportsEntries={sportsEntries} />
      
      <CardSports entrySports={sportsEntries}/></div>

      
    </div>
  );
};

export default RightSidebar;
