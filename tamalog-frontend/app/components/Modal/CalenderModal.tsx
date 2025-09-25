import React, { useState } from 'react';
import { EntrySports } from '../type';  // EntrySports型
import styles from './01Modal.module.css'; 
import Image from 'next/image';
import SportsBox from '../../public/SportsBoxing.png';
import SportsRing from '../../public/SportsRing.png';
import SportsSwim from '../../public/SportsSwimming.png';
import SportsWalk from '../../public/SportsWalking.png';
import { saveEntrySportsToFirestore } from '../../../firebase/saveDataFunctions';  // Firestoreに保存する関数をインポート

interface CalendarModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSportsEntries: React.Dispatch<React.SetStateAction<EntrySports[]>>;  // 親のスポーツエントリ更新関数
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isModalOpen, setIsModalOpen, setSportsEntries }) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [date, setDate] = useState<string>('');  // 日付入力を管理
  const [time, setTime] = useState<string>('');  // 時間入力を管理

  // アイコン選択時のハンドラ
  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
  };

  // 日付の変更ハンドラ
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  // 時間の変更ハンドラ
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 日付の形式チェック (YYYY-MM-DD)
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!isValidDate) {
      alert('日付の形式が正しくありません。YYYY-MM-DD の形式で入力してください。');
      return;
    }

    if (!selectedIcon || !time || !date) {
      alert('アイコン、日付、時間をすべて入力してください。');
      return;
    }

    const newEntry: EntrySports = {
      id: `${new Date().getTime()}`,  // IDを一意に生成（ここではtimestampを使用）
      date,  // 手動で入力された日付
      icon: selectedIcon,  // 選択されたアイコン
      time,  // 入力された時間
    };

    try {
      // Firestoreにデータを保存
      await saveEntrySportsToFirestore(newEntry);

      // 親のstateを更新
      setSportsEntries(prevEntries => [...prevEntries, newEntry]);
      setIsModalOpen(false);  // モーダルを閉じる
      
      // フォームをリセット
      setSelectedIcon(null);
      setDate('');
      setTime('');
      
      // ページをリロードして即座に反映
      window.location.reload();
    } catch (error) {
      console.error('Firestoreへのデータ保存に失敗:', error);
      alert('データ保存中にエラーが発生しました。');
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContent}>
            <h2 className="text-xl font-bold mb-4">Add SportsData</h2>

            {/* 日付入力欄 */}
            <div className="mb-4">
              <label className="block mb-1">Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
                placeholder="例: 2024-11-11"
                className="border p-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Sports:</label>
              <div className={styles.iconSelection}>
                <button
                  onClick={() => handleIconSelect('Boxing')}
                  className={selectedIcon === 'Boxing' ? styles.selected : ''}
                >
                  <Image src={SportsBox} alt="Boxing" width={60} height={60} />
                </button>
                <button
                  onClick={() => handleIconSelect('Walking')}
                  className={selectedIcon === 'Walking' ? styles.selected : ''}
                >
                  <Image src={SportsWalk} alt="Walking" width={60} height={60} />
                </button>
                <button
                  onClick={() => handleIconSelect('Ring')}
                  className={selectedIcon === 'Ring' ? styles.selected : ''}
                >
                  <Image src={SportsRing} alt="Ring" width={60} height={60} />
                </button>
                <button
                  onClick={() => handleIconSelect('Swimming')}
                  className={selectedIcon === 'Swimming' ? styles.selected : ''}
                >
                  <Image src={SportsSwim} alt="Swimming" width={60} height={60} />
                </button>
              </div>
            </div>

            {/* 時間入力欄 */}
            <div className="mb-4">
              <div className={styles.timeInput}>
                <label className="block mb-1">Time:</label>
                <input
                  type="number"
                  id="time"
                  value={time}
                  onChange={handleTimeChange}
                  placeholder="時間を入力"
                  className="border p-2 w-full"
                />
              </div>
            </div>

            <div className={styles.buttons}>
              <button onClick={handleSubmit} className={styles.modalButton}>とうろく</button>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalButtonclose}>閉じる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModal;
