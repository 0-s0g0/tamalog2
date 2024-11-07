///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from '../../style.module.css'; 
import { useState, useEffect } from 'react';

// Firebase関連のインポート
import { auth } from '../../../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signOut } from "firebase/auth";

interface Icon {
    src: string;
    alt: string;
  }
  
  interface NicknameModalProps {
    isSignupSuccess: boolean;
    isNicknameModalOpen: boolean;
    setIsNicknameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    //setIsNicknameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    icons: { src: string }[]; // アイコンの型を定義
    selectedIcon: number; // nullを許容しない
    setSelectedIcon: React.Dispatch<React.SetStateAction<number>>; // 同様にsetSelectedIconもnumberに変更
    nickname: string;
    setNickname: React.Dispatch<React.SetStateAction<string>>;
    goalWeight: string;
    setGoalWeight: React.Dispatch<React.SetStateAction<string>>;
    goalFat: string;
    setGoalFat: React.Dispatch<React.SetStateAction<string>>;
    goalMuscle: string;
    setGoalMuscle: React.Dispatch<React.SetStateAction<string>>;
  }
  
export const NicknameModal: React.FC<NicknameModalProps> = ({
    isSignupSuccess,
    //setIsNicknameModalOpen,
    isNicknameModalOpen,
    setIsNicknameModalOpen,
    icons,
    selectedIcon,
    setSelectedIcon,
    nickname,
    setNickname,
    goalWeight,
    setGoalWeight,
    goalFat,
    setGoalFat,
    goalMuscle,
    setGoalMuscle,
  }) => {
    //const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
    const handleIconSelect = (index: number) => {
      setSelectedIcon(index); // アイコン選択
    };
  
    const handleNicknameFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // フォーム送信時にページ遷移を防ぐ
      console.log('Nickname:', nickname); // 保存処理が必要な場合
    };
  
    const handleCloseNicknameModalInternal = () => {
        console.log("Close button clicked");
        setIsNicknameModalOpen(false); // 親から渡された関数を呼び出し
    };
  
    const handleLogoutInternal = async () => {
      try {
        await signOut(auth); // Firebaseでログアウト
        console.log("ログアウトしました");
        setIsNicknameModalOpen(false); // モーダルを閉じる
      } catch (error) {
        console.error("ログアウト時にエラーが発生しました:", error);
        alert("ログアウト時にエラーが発生しました");
      }
    };
  
    return (
      <div className={styles.modalBackground}>
        <div className={styles.modalContent}>
          <h2 className="text-xl font-bold mb-4">My Account</h2>
          <form onSubmit={handleNicknameFormSubmit}>
            {/* ニックネーム入力欄 */}
            <div className="mb-4">
              <label className="block mb-1">ニックネーム:</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="border p-2 w-full"
              />
            </div>
  
            {/* アイコン選択 */}
            <div className="mb-4">
              <label className="block mb-1">プロフィール画像を選択:</label>
              <div className="flex space-x-4">
                {icons.map((icon, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 rounded-full cursor-pointer ${
                      selectedIcon === index ? 'border-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleIconSelect(index)} // アイコン選択
                  >
                    <img
                      src={icon.src}
                      alt={`Icon ${index + 1}`}
                      className={`w-full h-full object-cover rounded-full ${
                        selectedIcon !== index ? 'opacity-50' : 'opacity-100'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
  
            <div className="my-4 border-t border-gray-300" />
  
            {/* 目標設定 */}
            <h3 className="text-lg font-semibold mb-4">目標設定</h3>
            <div className="mb-4">
              <label className="block mb-1">体重:</label>
              <input
                type="number"
                step="any"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
  
            <div className="mb-4">
              <label className="block mb-1">脂肪:</label>
              <input
                type="number"
                step="any"
                value={goalFat}
                onChange={(e) => setGoalFat(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
  
            <div className="mb-4">
              <label className="block mb-1">筋肉:</label>
              <input
                type="number"
                step="any"
                value={goalMuscle}
                onChange={(e) => setGoalMuscle(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
  
            {/* ニックネーム設定完了ボタン */}
            <button type="submit" className={styles.modalButton}>save</button>
  
            {/* モーダルを閉じるボタン */}
            <button type="button" onClick={handleCloseNicknameModalInternal} className={styles.modalButtonclose}>Close</button>
  
            {/* ログアウトボタン */}
            <button type="button" onClick={handleLogoutInternal} className={styles.modalButtonclose}>log out</button>
          </form>
        </div>
      </div>

      
    );
  };

  export default NicknameModal