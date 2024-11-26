"use client";
///////////////////////////////////////////
// import
///////////////////////////////////////////
//main
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';


//copmponents
import CountDisplay from './components/Sidebar/Countdisplay';
import CardGoal from './components/Card/CardGoal';
import CardNow from './components/Card/CardNow';
import Charts_Line from './components/Charts/charts_Line';  
import Charts_Dounut from './components/Charts/charts_Dounut';  
import Datatable_UI from './components/Datatable/Datatable_UI'; 
import RightSidebar from './components/Sidebar/RightSidebar';
import LeftSidebar from './components/Sidebar/LeftSidebar';
import Header from './components/Header/Header';




import { getRandomTip } from './components/Tip/GetRandomTip'; // 関数をインポート

// Firebase
import { auth, db} from '../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signOut } from "firebase/auth";
import { getEntriesFromFirestore, getEntryACFromFirestore, getEntrySportsFromFirestore, getCountEntriesFromFirestore} from "../firebase/saveDataFunctions";

//style
import styles from './styles/start.module.css';


//type
import { Entry,EntryAC, EntrySports } from './components/type'; 


//Image
import logo from './public/logo2.png'

///////////////////////////////////////////
// メインコンポーネント
///////////////////////////////////////////
export default function Home() {
  ///////////////////////////////////////////
  // ステート管理
  ///////////////////////////////////////////
  // データ関連
  const [entries, setEntries] = useState<Entry[]>([]);
  const [entryAC, setEntryAC] = useState<EntryAC[]>([]);
  const [sportsEntries, setSportsEntries] = useState<EntrySports[]>([]); 
  const [date, setDate] = useState('');
  const [bodyWater, setBodyWater] = useState('');
  const [protein, setProtein] = useState('');
  const [minerals, setMinerals] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0); // カウント用の状態
  const [tip, setTip] = useState(getRandomTip())

  // モーダル開閉制御
  const [isTextInputModalOpen, setIsTextInputModalOpen] = useState(false);
  const [isImageInputModalOpen, setIsImageInputModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isCheerModalOpen, setIsCheerModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 画像関連
  const [imageProcessingResults, setImageProcessingResults] = useState<number[]>([]);//画像処理の結果を次のモーダルへ渡す
  


  // 認証関連のstate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [nickname, setNickname] = useState<string>(''); 
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
  
  //env
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  ///////////////////////////////////////////
  // レンダリング時の処理
  ///////////////////////////////////////////
  //API
  useEffect(() => {
    const fetchEntries = async () => {
      const response = await fetch('/api/post');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    };

    fetchEntries();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        await getEntriesFromFirestore(setEntries);
        await getEntryACFromFirestore(setEntryAC);
        await getEntrySportsFromFirestore(setSportsEntries);
        await getCountEntriesFromFirestore(setEntries);
      }
    };
    fetchData();
  }, [auth.currentUser]);

  useEffect(() => {
    setCount(entries.length); // entriesの長さをcountとして設定
  }, [entries]); // entriesが変わるたびに実行

  useEffect(() => {
    const fetchSportsData = async () => {
      await getEntrySportsFromFirestore(setSportsEntries);
    };
    fetchSportsData();
  }, []);

    // ログイン状態の監視
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsLoggedIn(!!user);  // ユーザーがログインしていればtrue、ログインしていなければfalse
      });
  
      return () => unsubscribe();  // コンポーネントがアンマウントされた際に監視を解除
    }, []);

  ///////////////////////////////////////////
  //関数
  ///////////////////////////////////////////

  // 体脂肪率の計算
  const calculateBodyFatPercentage = (bodyFat: number, totalWeight: number) => {
    if (totalWeight === 0) return 0;
    return (bodyFat / totalWeight) * 100;
  };

  ///////////////////////////////////////////
  // イベントハンドラー
  ///////////////////////////////////////////

// エントリー編集
const handleEdit = (id: string) => {
  // 編集したいエントリーを、IDを元に検索
  const entryToEdit = entries.find(entry => entry.id === id);
  if (entryToEdit) {
    // 見つかった場合、フォームにそのエントリーのデータをセット
    setDate(entryToEdit.date);
    setBodyWater(entryToEdit.bodyWater);
    setProtein(entryToEdit.protein);
    setMinerals(entryToEdit.minerals);
    setBodyFat(entryToEdit.bodyFat);
    // 編集モードに切り替え、編集中のエントリーのIDを保存
    setEditingId(id);
    // モーダルを開く
    setIsTextInputModalOpen(true);
  }
};



// エントリー削除
const handleDelete = async (id: string) => {
  // 削除確認のダイアログ
  if (confirm('本当に削除しますか？')) {
    // 削除リクエスト
    await fetch('/api/post', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    // エントリーリストから削除
    setEntries(entries.filter(entry => entry.id !== id));
  }
};
//
const handleSetNickname = (newNickname: string) => {
  setNickname(newNickname); // NicknameModal から受け取ったニックネームを設定
};

// 認証関連ハンドラー（ログイン/サインアップ）
const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // フォーム送信時にページ遷移を防ぐ

  try {
    if (isLoginMode) {
      // ログイン処理
      await signInWithEmailAndPassword(auth, email, password);
      alert('ログイン成功');
    } else {
      // サインアップ処理
      await createUserWithEmailAndPassword(auth, email, password);
      alert('アカウント作成成功');
      setIsSignUpModalOpen(false);  // サインアップモーダルを閉じる
      setIsNicknameModalOpen(true); // ニックネーム設定モーダルを開く
    }
  } catch (error: any) {
    // エラーハンドリング
    if (error.code === 'auth/email-already-in-use') {
      alert('このメールアドレスはすでに使用されています。');
    } else if (error.code === 'auth/invalid-email') {
      alert('無効なメールアドレスです。');
    } else if (error.code === 'auth/wrong-password') {
      alert('間違ったパスワードです。');
    } else {
      alert('エラーが発生しました: ' + error.message);
    }
  }
};

const handleNewTip = () => {
  setTip(getRandomTip());
};


// ログアウト処理
const handleLogout = async () => {
  try {
    await signOut(auth); // Firebase Auth でログアウト
    console.log("ログアウトしました");
    setIsSignupSuccess(false); // サインアップ成功フラグをリセット
    setIsNicknameModalOpen(false); // ニックネームモーダルを閉じる
    // ログイン・サインアップモーダルを開く、または必要に応じてリダイレクト
    // history.push('/login'); // React Routerを使用している場合、ログインページへリダイレクト
  } catch (error) {
    console.error("ログアウト時にエラーが発生しました:", error);
    alert("ログアウト時にエラーが発生しました");
  }
};





  ///////////////////////////////////////////
  // UIレンダリング
  ///////////////////////////////////////////
  return (
    <div className={styles.startback}>
      <div className={styles.title}>

        <div className={styles.title_text}>がんばる九工大生を応援</div>
        <Image src={logo} alt="Piyo image" className={styles.logo}></Image>
        <Link href="/mobile-page" passHref>
        <div className={styles.title_text}>モバイルページへ</div>
        </Link>
        <Link href="/PC" passHref>
        <div className={styles.title_text}>PCページへ</div>
        </Link>
        
      </div>

    </div>
    
  );
}
