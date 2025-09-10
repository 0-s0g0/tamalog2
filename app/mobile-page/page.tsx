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
import CardGoal2 from '../components/Card/CardGoal2';
import CardNow from '../components/Card/CardNow';
import Charts_Line from '../components/Charts/charts_Line';  
import Charts_Dounut from '../components/Charts/charts_Dounut';  
import Datatable_UI from '../components/Datatable/Datatable_UI'; 
import Header2 from '../components/Header/Header2';
import Footer from '../components/Footer/Footer';



import { getRandomTip } from '../components/Tip/GetRandomTip'; // 関数をインポート

// Firebase
import { auth, db} from '../../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import { getEntriesFromFirestore, getEntryACFromFirestore, getEntrySportsFromFirestore, getCountEntriesFromFirestore} from "../../firebase/saveDataFunctions";

//style
import styles from '../styles/main.module.css';
import local from '../styles/localMOBILE.module.css'



//type
import { Entry,EntryAC, EntrySports } from '../components/type'; 


//Image
import icon01 from '../public/icon1.png';
import icon02 from '../public/icon2.png';
import icon03 from '../public/icon3.png';
import icon04 from '../public/icon4.png';
import Title01 from '../public/Title01.png';
import Title02 from '../public/Title02.png';
import Title03 from '../public/Title03.png';
import Title04 from '../public/Title04.png';
import piyo01 from '../public/piyo01.png'
import piyo02 from '../public/piyo02.png'
import piyo03 from '../public/piyo03.png'
import piyo04 from '../public/piyo04.png'
import piyo05 from '../public/piyo05.png'
import piyo06 from '../public/piyo06.png'
import kaunt from '../public/kaunt1.png'
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
  const [isCheerModalOpen, setIsCheerModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

// Touch event handlers for piyo button
const handlePiyoTouchStart = (e: React.TouchEvent) => {
  e.preventDefault();
};

const handlePiyoTouchEnd = (e: React.TouchEvent) => {
  e.preventDefault();
  handleNewTip();
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

//ランクに応じて画像変更
  // カウント数に基づいて画像を切り替える関数
  const getImageForCount = (count: number) => {
    if (count >= 25) return piyo06; // 25以上はpiyo06固定
    if (count >= 20) return piyo05;
    if (count >= 15) return piyo04;
    if (count >= 10) return piyo03;
    if (count >= 5) return piyo02;
    return piyo01;
  };

  const currentImage = getImageForCount(entries.length);

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
      <Header2/>
      {/* メインコンテンツ */}
        <div className={local.mainbackContent}>
          <div className={local.mainContent}>
              <div className={styles.piyoback}>       
                <button 
                  onClick={handleNewTip} 
                  onTouchStart={handlePiyoTouchStart}
                  onTouchEnd={handlePiyoTouchEnd}
                  style={{ 
                    padding: '10px', 
                    fontSize: '16px', 
                    marginLeft: '-20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    userSelect: 'none',
                    position: 'relative',
                    zIndex: 20
                  }}
                >
                  <Image src={currentImage} alt="Piyo image" className={styles.piyo}></Image>
                </button>
                <div className={styles.container}>
                  <div className={styles.piyoime}>
                  <Image src={kaunt} alt="Sample image" height={500} />
                  <div className={styles.tip}>{tip}</div>
                  </div>
                </div>
              </div>

            {/*Title01*/}
            <div className={styles.titleback}>
              <Image src={Title01} alt="Title_goal" className={styles.titleImage}/>
            </div>

            {/*目標カード*/}
            <div className={styles.goalback}>
              <CardGoal2
              latestEntryAC={latestEntryAC}
              latestEntry={latestEntrytoGOAL}
              /> 
            </div>

            {/*Title02*/}
            <div className={styles.titleback}>
              <Image src={Title02} alt="Title_BodyComposition" className={styles.titleImage}/>
            </div>

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
            
            {/*Title03*/}
            <div className={styles.titleback}>
              <Image src={Title03} alt="Title_Histry" className={styles.titleImage}/>
            </div>

            <Charts_Line
              entries={entries}
              latestEntry={latestEntry}
              bodyFatPercentage={bodyFatPercentage}
            />
            
            {/*Title04*/}
            <div className={styles.titleback}>
              <Image src={Title04} alt="Title_List" className={styles.titleImage}/>
            </div>


            {/* データテーブル表示 */}
            <Datatable_UI 
                entries={entries} 
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
              
            
              
          </div>

        </div>
      <Footer/>
    </div>
    
  );
}
