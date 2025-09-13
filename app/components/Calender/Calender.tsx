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
  refreshData?: () => void;
}

export const CalendarWithIcons: React.FC<CalendarProps> = ({ sportsEntries, refreshData }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 選択された日付
  const [loadedSportsEntries, setLoadedSportsEntries] = useState<EntrySports[]>([]);

  // Firestoreからデータを取得する処理
  const fetchData = async () => {
    // Firebaseからデータを取得
    await getEntrySportsFromFirestore(setLoadedSportsEntries);
  };

  useEffect(() => {
    fetchData();
  }, []); // コンポーネントの初回レンダリング時にデータを取得

  // 外部から呼び出し可能なリフレッシュ関数を公開
  useEffect(() => {
    if (refreshData) {
      // refreshData関数をfetchDataに置き換えて外部から呼び出せるようにする
      (window as any).refreshCalendarData = fetchData;
    }
  }, [refreshData]);

  const tileContent = ({ date }: any) => {
    // カレンダーからの選択された日付を string 型（yyyy-mm-dd）で取得
    const formattedDate = date.toISOString().split('T')[0]; // 例: "2024-11-23"
  
    // Firestoreから取得したスポーツエントリの日付（string 型）を1日減らす
    const adjustedEntries = sportsEntries.map((entry) => {
      const entryDate = entry.date; // "2024-11-11" など
      const [year, month, day] = entryDate.split('-').map(Number); // 年、月、日を取得
  
      // 日付部分を1日減らす
      const adjustedDay = day;
      
      // 調整した日付を再構成
      const adjustedDate = new Date(year, month - 1, adjustedDay); // monthは0から始まるので-1する
      const adjustedDateString = adjustedDate.toISOString().split('T')[0]; // 再度yyyy-mm-ddに戻す
  
      return { ...entry, adjustedDate: adjustedDateString }; // adjustedDateを持たせる
    });
  
    // 調整された日付と選択された日付を比較
    const matchingEntries = adjustedEntries.filter((entry) => {
      return entry.adjustedDate === formattedDate; // 調整後の日付が一致するかチェック
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
      <Calendar
        value={selectedDate} // 選択されている日付を表示
        tileContent={tileContent} // 日付にアイコンを表示
        onClickDay={handleDateClick} // 日付をクリックしたときの処理
        locale="en-US" // カレンダーを英語表示にする
      />
      <div style={{margin:'20px'}}></div>

    </div>
  );
}

export default CalendarWithIcons;