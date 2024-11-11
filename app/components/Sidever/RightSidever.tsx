// Sidebar.tsx
import React, { useState, useEffect } from 'react';
import CalendarWithIcons from '../Calender/Calender';  // Calendarコンポーネントをインポート
import { EntrySports } from '../type';  // EntrySports型
import { getEntrySportsFromFirestore } from '../../../firebase/saveDataFunctions';  // Firestoreからデータを取得する関数
import styles from './RightSidever.module.css'

interface SidebarProps {
  // 親コンポーネントから渡されるスポーツデータ
  sportsEntries: EntrySports[];
}

const Sidebar: React.FC<SidebarProps> = ({ sportsEntries }) => {
  const [loadedSportsEntries, setLoadedSportsEntries] = useState<EntrySports[]>([]);

  // Firestoreからデータを取得する処理
  useEffect(() => {
    const fetchData = async () => {
      // Firebaseからデータを取得
      await getEntrySportsFromFirestore(setLoadedSportsEntries);
    };

    fetchData();
  }, []); // コンポーネントの初回レンダリング時にデータを取得

  return (
    <div className={styles.contener}>
      <h3>スポーツカレンダー</h3>
      {/* Calendarコンポーネントにスポーツデータを渡す */}
      <CalendarWithIcons sportsEntries={loadedSportsEntries} />
      <h3>スポーツカレンダー</h3>
      <h3>スポーツカレンダー</h3>
    </div>
  );
};

export default Sidebar;
