///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from '../../style.module.css'; 
import { Entry } from '../type';

import { useState, useEffect } from 'react';
import NicknameModal from './NicknameModal';

// Firebase関連のインポート
import { auth } from '../../../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface Props {
    isSignUpModalOpen: boolean;
    setIsSignUpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNicknameModalOpen: boolean;
    setIsNicknameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isSignupSuccess: boolean;
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
  
  const SignUpModal: React.FC<Props> = ({
    isSignUpModalOpen,
    setIsSignUpModalOpen,
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
    // 認証関連のstate
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoginMode, setIsLoginMode] = useState(true);
   const [isSignupSuccess, setIsSignupSuccess] = useState(false);
   //const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
   //const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
 
   // ログイン/サインアップフォームの送信処理
   const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault(); // フォーム送信時にページ遷移を防ぐ
     try {
       if (isLoginMode) {
         // ログインモードであれば、ログイン処理を実行
         await signInWithEmailAndPassword(auth, email, password);
         setIsSignUpModalOpen(false); // アカウントモーダルを閉じる
         alert('ログイン成功');
       } else {
         // サインアップモードであれば、アカウント作成処理を実行
         await createUserWithEmailAndPassword(auth, email, password);
         setIsSignupSuccess(true); // サインアップ成功
         setIsSignUpModalOpen(false); // アカウントモーダルを閉じる
         setIsNicknameModalOpen(true); // ニックネーム設定モーダルを開く
         alert('アカウント作成成功');
       }
     } catch (error) {
       // エラーハンドリング
       console.error('Authentication error:', error);
       alert('エラーが発生しました。');
     }
   };
 
   if (!isSignUpModalOpen) return null;
 
   return (
     <>
       <div className={styles.modalBackground}>
         <div className={styles.modalContent}>
           {/* ログインモードの内容 */}
           {isLoginMode ? (
             <>
               <h2 className="text-xl font-bold mb-4">ログイン</h2>
               <form onSubmit={handleAuthSubmit}>
                 {/* Email入力欄 */}
                 <div className="mb-4">
                   <label className="block mb-1">Email:</label>
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="border p-2 w-full"
                     required
                   />
                 </div>
 
                 {/* Password入力欄 */}
                 <div className="mb-4">
                   <label className="block mb-1">Password:</label>
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="border p-2 w-full"
                     required
                   />
                 </div>
 
                 {/* ログインボタン */}
                 <button type="submit" className={styles.modalButton}>
                   ログイン
                 </button>
               </form>
             </>
           ) : (
             // サインアップモードの内容
             <>
               <h2 className="text-xl font-bold mb-4">サインアップ</h2>
               <form onSubmit={handleAuthSubmit}>
                 {/* Email入力欄 */}
                 <div className="mb-4">
                   <label className="block mb-1">Email:</label>
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="border p-2 w-full"
                     required
                   />
                 </div>
 
                 {/* Password入力欄 */}
                 <div className="mb-4">
                   <label className="block mb-1">Password:</label>
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="border p-2 w-full"
                     required
                   />
                 </div>
 
                 {/* サインアップボタン */}
                 <button type="submit" className={styles.modalButton}>
                   サインアップ
                 </button>
               </form>
             </>
           )}
 
           {/* 横棒 */}
           <div className="my-4 border-t border-gray-300" />
 
           {/* 新規登録の誘導テキスト */}
           <div className="text-center mb-4">
             {isLoginMode ? (
               <p>
                 アカウントをお持ちでないですか？{' '}
                 <span
                   onClick={() => setIsLoginMode(false)}
                   className="text-blue-500 cursor-pointer"
                 >
                   新規登録はこちら
                 </span>
               </p>
             ) : (
               <p>
                 すでにアカウントをお持ちですか？{' '}
                 <span
                   onClick={() => setIsLoginMode(true)}
                   className="text-blue-500 cursor-pointer"
                 >
                   ログインはこちら
                 </span>
               </p>
             )}
           </div>
 
           {/* モーダルを閉じるボタン */}
           <button
             type="button"
             onClick={() => setIsSignUpModalOpen(false)}
             className={styles.modalButtonclose}
           >
             閉じる
           </button>
         </div>
       </div>
 
       {/* ニックネームモーダル */}
       {isNicknameModalOpen && (
        <NicknameModal
         isSignupSuccess={isSignupSuccess}
         isNicknameModalOpen={isNicknameModalOpen}
         setIsNicknameModalOpen={setIsNicknameModalOpen}
         icons={icons}
         selectedIcon={selectedIcon}
         setSelectedIcon={setSelectedIcon}
         nickname={nickname}
         setNickname={setNickname}
         goalWeight={goalWeight}
         setGoalWeight={setGoalWeight}
         goalFat={goalFat}
         setGoalFat={setGoalFat}
         goalMuscle={goalMuscle}
         setGoalMuscle={setGoalMuscle}
         />
       )}
      </>
    );
  };
 export default SignUpModal;
 