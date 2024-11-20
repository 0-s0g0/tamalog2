///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import { useState, useEffect } from 'react';
import styles from './01Modal.module.css'; 
import { Entry } from '../type';
import { getFirestore, doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../../firebase/firebase'

interface LogoutModalProps {
  nickname: string;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  nickname,
  isLogoutModalOpen,
  setIsLogoutModalOpen,
  handleLogout,
}) => {
  // モーダルを閉じる
  const closeModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {isLogoutModalOpen && (
        <div className={styles.modalBackground}>
        <div className={styles.modalContent}>
          <h2 className="text-xl font-bold mb-4">現在 {nickname} さんがログイン中</h2>
          <p className="mb-4">ログアウトしますか？</p>
          <div className="flex justify-around">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className={styles.modalButtonclose}
            >
              Close
            </button>
            <button
              onClick={handleLogout}
              className={styles.modalButton}
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default LogoutModal;

