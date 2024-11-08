///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../style.module.css'; 
import { Entry } from '../type';

import { getFirestore, doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
//import { getAuth } from 'firebase/auth';
import { db, auth } from '../../../firebase/firebase'
import { saveUserInfoToFirestore } from '../../../firebase/saveDataFunctions'; // Firebase関連の保存関数をインポート

interface Props {
  setIsNicknameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

const NicknameModal: React.FC<Props> = ({ setIsNicknameModalOpen, setUserInfo }) => {
  const [nickname, setNickname] = useState('');
  const [icon, setIcon] = useState('');
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [goalFat, setGoalFat] = useState('');
  const [goalMuscle, setGoalMuscle] = useState('');

  // ユーザー情報の保存
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nickname || !icon || !height || !sex || !goalWeight || !goalFat || !goalMuscle) {
      alert('全てのフィールドに入力してください');
      return;
    }

    const userInfo = {
      nickname,
      icon,
      height,
      sex,
      goalWeight,
      goalFat,
      goalMuscle
    };

    try {
      await saveUserInfoToFirestore(userInfo); // Firestoreにユーザー情報を保存
      setUserInfo(userInfo); // 親コンポーネントに情報を渡す
      setIsNicknameModalOpen(false); // モーダルを閉じる
    } catch (error) {
      console.error('Error saving user info:', error);
      alert('ユーザー情報の保存中にエラーが発生しました。');
    }
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <h2 className="text-xl font-bold mb-4">Set User Information</h2>
        <form onSubmit={handleSubmit}>
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
            <label className="block mb-1">Icon:</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Height:</label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Sex:</label>
            <input
              type="text"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Goal Weight:</label>
            <input
              type="text"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Goal Fat:</label>
            <input
              type="text"
              value={goalFat}
              onChange={(e) => setGoalFat(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Goal Muscle:</label>
            <input
              type="text"
              value={goalMuscle}
              onChange={(e) => setGoalMuscle(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <button type="submit" className={styles.modalButton}>Save</button>
          <button type="button" onClick={() => setIsNicknameModalOpen(false)} className={styles.modalButtonclose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default NicknameModal;
