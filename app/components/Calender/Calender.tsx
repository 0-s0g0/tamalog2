// Calendar.tsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Calender.module.css';  // スタイルのインポート
import Image from 'next/image';
import { EntrySports } from '../type'; // EntrySports型
import SportsBox from '../../public/SportsBoxing.png';
import SportsRing from '../../public/SportsRing.png';
import SportsSwim from '../../public/SportsSwimming.png';
import SportsWalk from '../../public/SportsWalking.png';
import { getEntrySportsFromFirestore } from '../../../firebase/saveDataFunctions'; // Firestoreからデータを取得する関数

interface CalendarProps {
  sportsEntries: EntrySports[];
}

export const CalendarWithIcons: React.FC<CalendarProps> = ({ sportsEntries }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 選択された日付
  const [loadedSportsEntries, setLoadedSportsEntries] = useState<EntrySports[]>([]);

  // Firestoreからデータを取得する処理
  useEffect(() => {
    const fetchData = async () => {
      // Firebaseからデータを取得
      await getEntrySportsFromFirestore(setLoadedSportsEntries);
    };

    fetchData();
  }, []); // コンポーネントの初回レンダリング時にデータを取得

  // カレンダーの日付にアイコンを表示する関数
  const tileContent = ({ date }: any) => {
    const formattedDate = date.toISOString().split('T')[0]; // "2024-11-23" のようにフォーマット

    const matchingEntries = sportsEntries.filter((entry) => {
      const entryDate = entry.date; // Firestoreから取得した日付
      return entryDate === formattedDate; // 日付が一致するものをフィルタリング
    });

    if (matchingEntries.length === 0) return null;

    return (
      <div className={styles['tile-content']}>
        {matchingEntries.map((entry, index) => {
          let icon;
          switch (entry.icon) {
            case 'Boxing':
              icon = <Image src={SportsBox} alt="Boxing" width={20} height={20} />;
              break;
            case 'Walking':
              icon = <Image src={SportsWalk} alt="Walking" width={20} height={20} />;
              break;
            case 'Ring':
              icon = <Image src={SportsRing} alt="Ring" width={20} height={20} />;
              break;
            case 'Swimming':
              icon = <Image src={SportsSwim} alt="Swimming" width={20} height={20} />;
              break;
            default:
              icon = null;
          }
          return <div key={index}>{icon}</div>;
        })}
      </div>
    );
  };

  // カレンダーをクリックしたときに日付を選択する処理
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.calendar}>
      <h3>Calendar</h3>
      <Calendar
        value={selectedDate} // 選択されている日付を表示
        tileContent={tileContent} // 日付にアイコンを表示
        onClickDay={handleDateClick} // 日付をクリックしたときの処理
        locale="en-US" // カレンダーを英語表示にする
      />
      <div className={styles['selected-date']}>
        <h4>Selected Date: {selectedDate ? selectedDate.toLocaleDateString() : 'None'}</h4>
      </div>
    </div>
  );
}

export default CalendarWithIcons;