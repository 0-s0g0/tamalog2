///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../style.module.css'; 
import { Entry } from '../type';


interface Props {
  isTextInputModalOpen: boolean;
  setIsTextInputModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  entries: Entry[];
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TextInputModal: React.FC<Props> = ({
  isTextInputModalOpen,
  setIsTextInputModalOpen,
  setEntries,
  entries,
  editingId,
  setEditingId
}) => {
  const [date, setDate] = useState('');
  const [bodyWater, setBodyWater] = useState('');
  const [protein, setProtein] = useState('');
  const [minerals, setMinerals] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  // フォーム送信処理（エントリー追加・更新）
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // フォーム送信時にページ遷移を防ぐ
    e.preventDefault();
    // 必須フィールドが未入力の場合、エラーメッセージを表示
    if (!date || !bodyWater || !protein || !minerals || !bodyFat) {
      alert('全てのフィールドに入力してください');
      return;
    }
    // 入力された各フィールドの値を合計して総体重を算出
    const totalWeight = parseFloat(bodyWater) + parseFloat(protein) + parseFloat(minerals) + parseFloat(bodyFat);
    const newEntry: Entry = { 
      id: editingId || Date.now().toString(), // 編集モードならそのIDを使用、そうでなければ新しいIDを生成
      date, 
      bodyWater, 
      protein, 
      minerals, 
      bodyFat, 
      totalWeight 
    };
    try {
      // 編集モードの場合、PUTリクエストでエントリーを更新
      if (editingId) {
        const response = await fetch('/api/post', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry),
        });
        if (!response.ok) throw new Error('Error updating the entry');
        // エントリーの更新
        setEntries(entries.map(entry => (entry.id === editingId ? newEntry : entry)));
      } else {
        // 新規エントリーの場合、POSTリクエストで追加
        const response = await fetch('/api/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry),
        });
        if (!response.ok) throw new Error('Error adding the new entry');
        // エントリーをリストに追加
        setEntries([...entries, newEntry]);
      }
      // フォームリセット
      setDate('');
      setBodyWater('');
      setProtein('');
      setMinerals('');
      setBodyFat('');
      setEditingId(null);
      setIsTextInputModalOpen(false);
    } catch (error) {
      // エラーハンドリング
      console.error('Error processing form submission:', error);
      alert('データの処理中にエラーが発生しました。');
    }
  };

  if (!isTextInputModalOpen) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <h2 className="text-xl font-bold mb-4">Add Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Body Water:</label>
            <input
              type="number"
              step="any"
              value={bodyWater}
              onChange={(e) => setBodyWater(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Protein:</label>
            <input
              type="number"
              step="any"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Minerals:</label>
            <input
              type="number"
              step="any"
              value={minerals}
              onChange={(e) => setMinerals(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Body Fat:</label>
            <input
              type="number"
              step="any"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <button type="submit" className={styles.modalButton}>Add</button>
          <button type="button" onClick={() => setIsTextInputModalOpen(false)} className={styles.modalButtonclose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default TextInputModal;
