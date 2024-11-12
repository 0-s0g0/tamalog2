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
import CountDisplay from './components/Countdisplay';
import CalendarWithIcons from './components/Calender/Calender';  // Calendarコンポーネントをインポート
import CardGoal from './components/Card/CardGoal';
import CardNow from './components/Card/CardNow';
import Charts_Line from './components/Charts/charts_Line';  
import Charts_Dounut from './components/Charts/charts_Dounut';  
import Datatable_UI from './components/Datatable/Datatable_UI'; 
import RightSidebar from './components/Sidebar/RightSidebar';  //
import TextInputModal from './components/Modal/TextInput_UI' ; 
import TextfromIMAGEModal from './components/Modal/TextfromIMAGE_UI' ; 
import AuthModal from './components/Modal/AuthModal';
import NicknameModal from './components/Modal/Nickname'
import LogoutModal from './components/Modal/LogoutModal';
import CalendarModal from './components/Modal/CalenderModal'


import { getRandomTip } from './components/Tip/GetRandomTip'; // 関数をインポート

// Firebase
import { auth, db} from '../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getEntriesFromFirestore, getEntryACFromFirestore, getEntrySportsFromFirestore, getCountEntriesFromFirestore} from "../firebase/saveDataFunctions";

//style
import styles from './style.module.css';
import local from './styles/local.module.css'
import stylesSidever from './styles/sidever.module.css';


//type
import { Entry,EntryAC, EntrySports } from './components/type'; 


//Image
import sample_img from './public/image01.png';
import logo from './public/logo.png';
import sideBarImage00 from './public/Sidever_image000.png';
import sideBarImage01 from './public/Sidever_image001a.png';
import sideBarImage02 from './public/Sidever_image002.png';
import sideBarImage03 from './public/Sidever_image003.png';
import sideBarImage04 from './public/Sidever_image004.png';
import icon01 from './public/icon1.png';
import icon02 from './public/icon2.png';
import icon03 from './public/icon3.png';
import icon04 from './public/icon4.png';
import { text } from 'node:stream/consumers';
import Title01 from './public/Title01.png';
import Title02 from './public/Title02.png';
import Title03 from './public/Title03.png';
import Title04 from './public/Title04.png';
import piyo03 from './public/piyo03.png'
import kaunt from './public/kaunt1.png'
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
  const [error, setError] = useState<string>(''); // エラーメッセージの状態

  // モーダル開閉制御
  const [isTextInputModalOpen, setIsTextInputModalOpen] = useState(false);
  const [isImageInputModalOpen, setIsImageInputModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // 画像関連
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageProcessingResults, setImageProcessingResults] = useState<number[]>([]);
  


  // 認証関連のstate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [nickname, setNickname] = useState<string>(''); 
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  //右サイドバー
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());  // 選択された日付の状態
 

  // アイコンの選択
  const icons = [icon01, icon02, icon03, icon04];
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null); // 選択されたアイコンのインデックス
  
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

// 画像アップロード処理
const saveImageUrlToFirestore = async (url: string) => {
  // Firestoreへの参照を取得
  const db = getFirestore();
  const entryId = Date.now().toString(); // 画像アップロード時のユニークなIDを生成
  try {
    // Firestoreの 'entries' コレクションに、画像URLを保存
    await setDoc(doc(db, 'entries', entryId), { imageUrl: url });
    console.log('Image URL saved to Firestore:', url);
  } catch (error) {
    // エラーハンドリング
    console.error('Error saving image URL to Firestore:', error);
  }
};

// 画像アップロードイベント
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

// フォーム送信処理（エントリー追加・更新）
const handleImageSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(`http://127.0.0.1:5000/backend/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 画像処理結果を取得
      const result = response.data;
      setImageProcessingResults(result);  // 結果を状態に保存
      setIsTextInputModalOpen(true);  // モーダルを開く

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Axios固有のエラーの場合
        if (error.response) {
          // サーバーがエラーを返した場合（4xx, 5xx）
          const statusCode = error.response.status;
          if (statusCode >= 400 && statusCode < 500) {
            alert(`クライアントエラーが発生しました: ${statusCode} - ${error.response.data.error || '不明なエラー'}`);
          } else if (statusCode >= 500) {
            alert(`サーバーエラーが発生しました: ${statusCode} - サーバーが正常に処理できませんでした`);
          }
        } else if (error.request) {
          // サーバーからのレスポンスがなかった場合（ネットワークエラーなど）
          alert('ネットワークエラーが発生しました。サーバーに接続できませんでした。');
        }
      } else {
        // その他のエラー（一般的なJavaScriptエラーなど）
        console.error('エラー詳細:', error);
        alert('画像アップロード中にエラーが発生しました');
      }
    }
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
  // 各データ計算
  ///////////////////////////////////////////
  const Mynickname = entryAC[entryAC.length - 1]?.nickname || 'user';
  
  // 最新のgoal
  const latestEntryAC = entryAC[entryAC.length - 1] || {
    goalWeight: '0',
    goalFat: '0',
    goalMuscle: '0'
  };
  // goal値に対する最新のEntry
  const latestEntrytoGOAL = entries[entries.length - 1] || {
    totalWeight: 0,
    bodyFat: '0',
    totalMuscle: 0
  };
  // 最新(現在の)Entry
  const latestEntry = entries[entries.length - 1] || {
    bodyWater: '0',
    protein: '0',
    minerals: '0',
    bodyFat: '0'
  };
  // 最新からひとつ前のEntry
  const previousEntry = entries[entries.length - 2] || {
    bodyWater: '0',
    protein: '0',
    minerals: '0',
    bodyFat: '0'
  };

  // 各項目の変化量を計算  
  const bodyFatPercentage = calculateBodyFatPercentage(parseFloat(latestEntry.bodyFat), latestEntry.totalWeight);

  ///////////////////////////////////////////
  // UIレンダリング
  ///////////////////////////////////////////
  return (
    <div className={local.body}>
      <div className={local.fullbackContent}>
      {/* サイドバー */}
      <aside className={stylesSidever.sidebar}>
        <Image
          src={logo}
          alt="Open Modal"
          width={200} // 画像の幅を設定
        />
        {/* ログイン状態に応じてボタンを切り替え */}
        {isLoggedIn ? (
          <button onClick={() => setIsLogoutModalOpen(true)} className={stylesSidever.sidebarButton}>
            <div className={stylesSidever.buttonContent}>
              <Image
                src={icon01}
                alt="Open Modal"
                width={50} // 画像の幅を設定
                height={50} // 画像の高さを設定
              />
            </div>
          </button>
        ) : (
          <button onClick={() => setIsSignUpModalOpen(true)} className={stylesSidever.sidebarButton}>
            <div className={stylesSidever.buttonContent}>
              <Image
                src={sideBarImage00}
                alt="Open Modal"
                width={150} // 画像の幅を設定
                height={50} // 画像の高さを設定
              />
            </div>
          </button>
        )}

        <button onClick={() => setIsTextInputModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image
              src={sideBarImage01}
              alt="Open Modal"
              width={150}
              height={50}
            />
          </div>
        </button>

        <button onClick={() => setIsImageInputModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image
              src={sideBarImage02}
              alt="Open Modal"
              width={150}
              height={50}
            />
          </div>
        </button>

        <button onClick={() => setIsNicknameModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image
              src={sideBarImage03}
              alt="Open Modal"
              width={150}
              height={50}
            />
          </div>
        </button>

        <button onClick={() => setIsCalendarModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image
              src={sideBarImage04}
              alt="Open Modal"
              width={150}
              height={50}
            />
          </div>
        </button>

        <div className={stylesSidever.imageContainer}>
          {/* 画像の上にCountDisplayを配置 */}
          <CountDisplay entries={entries} />
        </div>
      </aside>
        

      {/* メインコンテンツ */}
      <div className={local.mainbackContent}>
        <div className={local.mainContent}>
          <h1 className="text-2xl font-bold mb-4">Home Page!</h1>
            <div className={styles.piyo}>          
              <button onClick={handleNewTip} style={{ padding: '10px', fontSize: '16px', marginLeft: '20px' }}>
                  <Image src={piyo03} alt="Sample image" width={250} />
              </button>
              <div className={styles.container}>
                <div className={styles.piyoime}>
                <Image src={kaunt} alt="Sample image" width={600} />
                <div className={styles.tip}>{tip}</div>
                </div>
              </div>
            </div>
          <Link href='/create-post'>Move Create Post Page</Link>
          <Image
            src={Title01}
            alt="Sample image"
            width={300}
          />

          {/* メトリクスカード */}
          <CardGoal
          latestEntryAC={latestEntryAC}
          latestEntry={latestEntrytoGOAL}
          />  
          <Image
            src={Title02}
            alt="Sample image"
            width={300}
          />

          <div className={local.grid}>

          
            {/* グラフ表示*/}
            <Charts_Dounut
                entries={entries}
                latestEntry={latestEntry}
                bodyFatPercentage={bodyFatPercentage}
              />
              <CardNow
              latestEntry={latestEntry}
              previousEntry={previousEntry}
              />
          </div>
          <Image
            src={Title03}
            alt="Sample image"
            width={300}
          />

          <Charts_Line
            entries={entries}
            latestEntry={latestEntry}
            bodyFatPercentage={bodyFatPercentage}
          />
          <Image
            src={Title04}
            alt="Sample image"
            width={300}
          />
          <div></div>
          {/* データテーブル表示 */}
          <Datatable_UI 
              entries={entries} 
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
            
        </div>
        {/* 右側のサイドバー（カレンダー） */}
        <div className={local.sidebarRight}>
        <RightSidebar sportsEntries={sportsEntries} />
        </div>
      </div>

      {/* テキスト入力用モーダルフォーム*/}
      <TextInputModal
        isTextInputModalOpen={isTextInputModalOpen}
        setIsTextInputModalOpen={setIsTextInputModalOpen}
        setEntries={setEntries}
        entries={entries}
        editingId={null}
        setEditingId={() => {}}
      />

       {/* 画像入力用モーダル */}
       {isImageInputModalOpen && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContent}>
            <h2 className="text-xl font-bold mb-4">Upload Image</h2>
            <form onSubmit={handleImageSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Choose Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border p-2 w-full"
                />
              </div>
              {/* プレビュー用の画像表示 */}
              {imagePreview && (
                <div className="mb-4">
                  <img src={imagePreview} alt="Preview" className="w-full h-auto mb-2" />
                </div>
              )}
              <button type="submit" className={styles.modalButton}>Upload</button>
              <button type="button" onClick={() => setIsImageInputModalOpen(false)} className={styles.modalButtonclose}>Close</button>
            </form>
          </div>
        </div>
      )}


      {/* TextfromIMAGEModal を組み込む */}
      <TextfromIMAGEModal 
        isTextInputModalOpen={isTextInputModalOpen}
        setIsTextInputModalOpen={setIsTextInputModalOpen}
        imageProcessingResults={imageProcessingResults}
        entries={[]}
        setEntries={() => {}}
        editingId={null}
        setEditingId={() => {}}
      />

      {/* ニックネーム設定モーダル */}
      <NicknameModal
        isNicknameModalOpen={isNicknameModalOpen}
        setIsNicknameModalOpen={setIsNicknameModalOpen}
        setEntryAC={setEntryAC}
        entryAC={entryAC}
        editingId={null}
        setEditingId={() => {}}
        handleSetNickname={handleSetNickname}
      />

      <LogoutModal
          nickname={Mynickname} // 親から渡した nickname を表示
          setIsLogoutModalOpen={setIsLogoutModalOpen}
          isLogoutModalOpen={isLogoutModalOpen}
          handleLogout={handleLogout}
       />
      {/* ログイン・サインアップモーダル */}
      <AuthModal
        isSignUpModalOpen={isSignUpModalOpen}
        setIsSignUpModalOpen={setIsSignUpModalOpen}
        isLoginMode={isLoginMode}
        setIsLoginMode={setIsLoginMode}
        handleAuthSubmit={handleAuthSubmit}
        handleLogout={handleLogout}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
        {/* モーダル */}
        <CalendarModal
        isModalOpen={isCalendarModalOpen}  // モーダルが開いているか
        setIsModalOpen={setIsCalendarModalOpen}  // モーダルを閉じる関数
        setSportsEntries={setSportsEntries}  // 親のエントリ更新関数
      />
      
      </div>
    </div>
    
  );
}
