///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React, { useState } from 'react';
import styles from '../../style.module.css'; 
import { EntryAC } from '../type'; // EntryAC 型をインポート
import { db, auth } from '../../../firebase/firebase'; 
import { setDoc, doc } from 'firebase/firestore';

// EntryAC を Firestore に保存する関数
const saveEntryACToFirestore = async (entryAC: EntryAC) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'userProfiles', user.uid);
      await setDoc(userDocRef, {
        entryAC: entryAC
      }, { merge: true });
      console.log('EntryAC data successfully written to Firestore');
    } else {
      alert('ユーザーがログインしていません。');
    }
  } catch (error) {
    console.error('Error writing EntryAC to Firestore:', error);
    alert('データ保存中にエラーが発生しました。');
  }
};

interface Props {
    isNicknameModalOpen: boolean;
    setIsNicknameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    entryAC: EntryAC[];  
    setEntryAC: React.Dispatch<React.SetStateAction<EntryAC[]>>;
    editingId: string | null;
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  }
  
  

const NicknameModal: React.FC<Props> = ({
  isNicknameModalOpen,
  setIsNicknameModalOpen,
  setEntryAC,
  entryAC,
  editingId,
  setEditingId
}) => {
  const [goalWeight, setGoalWeight] =  useState('');
  const [goalFat, setGoalFat] =  useState('');
  const [goalMuscle, setGoalMuscle] =  useState('');
  const [nickname, setNickname] =  useState('');
  const [icon, setIcon] =  useState('');
  const [height, setHeight] =  useState('');
  const [sex, setSex] =  useState('');

  // フォーム送信処理
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!goalWeight || !goalFat || !goalMuscle || !nickname || !icon || !height || !sex) {
      alert('全てのフィールドに入力してください');
      return;
    }
  
    const newEntryAC: EntryAC = {
        id: editingId || Date.now().toString(),
      goalWeight,
      goalFat,
      goalMuscle,
      nickname,
      icon,
      height, 
      sex,
    };
  
    try {
        if (editingId) {
            // 編集モードのロジックが必要であればここに記述
          } else {
            // Firestoreにデータを保存
            await saveEntryACToFirestore(newEntryAC);
            setEntryAC([...entryAC, newEntryAC]);
          }
  
      // フォームリセット
      setGoalWeight('');
      setGoalFat('');
      setGoalMuscle('');
      setNickname('');
      setIcon('');
      setHeight('');
      setSex('');
      setEditingId(null);
      setIsNicknameModalOpen(false); // モーダルを閉じる
    } catch (error) {
      console.error('Error processing form submission:', error);
      alert('データの処理中にエラーが発生しました。');
    }
  };
  

  if (!isNicknameModalOpen) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <h2 className="text-xl font-bold mb-4">Set Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Goal Weight:</label>
            <input
              type="number"
              step="any"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Goal Fat:</label>
            <input
              type="number"
              step="any"
              value={goalFat}
              onChange={(e) => setGoalFat(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Goal Muscle:</label>
            <input
              type="number"
              step="any"
              value={goalMuscle}
              onChange={(e) => setGoalMuscle(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nickname:</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Icon (URL):</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Height (cm):</label>
            <input
              type="text" // height は string 型として扱う
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Sex:</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className={styles.modalButton}>Save</button>
          <button type="button" onClick={() => setIsNicknameModalOpen(false)} className={styles.modalButtonclose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default NicknameModal;
