// components/RightSidebar.tsx
import React from 'react';
import CalendarWithIcons from '../Calender/Calender';  // Calendarコンポーネントのインポート
import { EntrySports } from '../type';  // EntrySports型のインポート
import styles from './RightSidebar.module.css';  // スタイルのインポート
import CardSports  from '../Card/CardSports';
import local from '../../styles/local.module.css'
import Image from 'next/image';
import Title05 from '../../public/Title05.png'

interface RightSidebarProps {
  sportsEntries: EntrySports[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ sportsEntries }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles['sidebar-header']}>
      <div className={local.title}>
            <Image src={Title05} alt="Title_goal" width={800}/>
          </div>
      </div>
      <div className={styles['calendar-container']}>
        <CalendarWithIcons sportsEntries={sportsEntries} />
      
      <CardSports entrySports={sportsEntries}/></div>

      
    </div>
  );
};

export default RightSidebar;
