///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react'; 
import { useState, useEffect } from 'react';
import styles from './01Modal.module.css'; 
import { Entry } from '../type';

import { getFirestore, doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
//import { getAuth } from 'firebase/auth';
import { db, auth } from '../../../firebase/firebase'


// EntryをFirestoreに保存する関数
const saveEntryToFirestore = async (entry: Entry) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'userEntries', user.uid);
      await setDoc(userDocRef, {
        entries: arrayUnion(entry)
      }, { merge: true });
      console.log('Data successfully written to Firestore');
    } else {
      alert('ユーザーがログインしていません。');
    }
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    alert('データ保存中にエラーが発生しました。');
  }
};

// Firestoreからユーザーのエントリーを取得する関数
export const fetchEntriesFromFirestore = async (setEntries: React.Dispatch<React.SetStateAction<Entry[]>>) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'userEntries', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEntries(data.entries || []);
        console.log('User data fetched successfully:', data);
      } else {
        console.log('No user data found');
      }
    }
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    alert('データの取得中にエラーが発生しました。');
  }
};


interface Props {
  isTextInputModalOpen: boolean;
  setIsTextInputModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCheerModalOpen: boolean;
  setIsCheerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  entries: Entry[];
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TextInputModal: React.FC<Props> = ({
  isTextInputModalOpen,
  setIsTextInputModalOpen,
  isCheerModalOpen,
  setIsCheerModalOpen,
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

  // 編集モードでモーダルが開かれた時にフォームにデータを設定
  useEffect(() => {
    if (isTextInputModalOpen && editingId) {
      const entryToEdit = entries.find(entry => entry.id === editingId);
      if (entryToEdit) {
        setDate(entryToEdit.date);
        setBodyWater(entryToEdit.bodyWater);
        setProtein(entryToEdit.protein);
        setMinerals(entryToEdit.minerals);
        setBodyFat(entryToEdit.bodyFat);
      }
    } else if (!isTextInputModalOpen) {
      // モーダルが閉じられた時にフォームをリセット
      setDate('');
      setBodyWater('');
      setProtein('');
      setMinerals('');
      setBodyFat('');
    }
  }, [isTextInputModalOpen, editingId, entries]);

  // フォーム送信処理（エントリー追加・更新）
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !bodyWater || !protein || !minerals || !bodyFat) {
      alert('全てのフィールドに入力してください');
      return;
    }
    const totalWeight = parseFloat(bodyWater) + parseFloat(protein) + parseFloat(minerals) + parseFloat(bodyFat);
    const totalMuscle = parseFloat(bodyWater) + parseFloat(protein);
    const removeFat = parseFloat(bodyWater) + parseFloat(protein) + parseFloat(minerals);
    const newEntry: Entry = { 
      id: editingId || Date.now().toString(),
      date, 
      bodyWater, 
      protein, 
      minerals, 
      bodyFat, 
      totalWeight, 
      totalMuscle,
      removeFat
    };
  
    try {
      if (editingId) {
        // 編集モード: 既存エントリーを更新
        const updatedEntries = entries.map(entry =>
          entry.id === editingId ? newEntry : entry
        );
        setEntries(updatedEntries);
        
        // Firestoreでも更新処理を行う場合はここに記述
        // await updateEntryInFirestore(oldEntry, newEntry);
      } else {
        // 新規追加モード: 新しいエントリーを追加
        await saveEntryToFirestore(newEntry);
        setEntries([...entries, newEntry]);
      }
  
      // フォームをリセット
      setDate('');
      setBodyWater('');
      setProtein('');
      setMinerals('');
      setBodyFat('');
      setEditingId(null);
      setIsTextInputModalOpen(false);
      setIsCheerModalOpen(true);
    } catch (error) {
      console.error('Error processing form submission:', error);
      alert('データの処理中にエラーが発生しました。');
    }
  };
  

  if (!isTextInputModalOpen) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <h2 className="text-xl font-bold mb-4">にゅうりょく</h2>
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
            <label className="block mb-1">Body Waterasasasa:</label>
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
          <button type="submit" className={styles.modalButton}>
            {editingId ? 'Update' : 'Add'}
          </button>
          <button type="button" onClick={() => {setIsTextInputModalOpen(false)}} className={styles.modalButtonclose}>とじる</button>
        </form>
      </div>
    </div>
  );
};

export default TextInputModal;