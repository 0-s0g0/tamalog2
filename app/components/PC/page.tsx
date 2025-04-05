"use client";
///////////////////////////////////////////
// import
///////////////////////////////////////////
//main
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';


//copmponents
import CountDisplay from '../../components/Sidebar/Countdisplay';
import CardGoal from '../../components/Card/CardGoal';
import CardNow from '../../components/Card/CardNow';
import Charts_Line from '../../components/Charts/charts_Line';  
import Charts_Dounut from '../../components/Charts/charts_Dounut';  
import Datatable_UI from '../../components/Datatable/Datatable_UI'; 
import RightSidebar from '../../components/Sidebar/RightSidebar';
import LeftSidebar from '../../components/Sidebar/LeftSidebar';




import { getRandomTip } from '../../components/Tip/GetRandomTip'; // 関数をインポート

// Firebase
import { auth, db} from '../../../firebase/firebase';
import { getEntriesFromFirestore, getEntryACFromFirestore, getEntrySportsFromFirestore, getCountEntriesFromFirestore} from "../../../firebase/saveDataFunctions";

//style
import styles from '../../styles/main.module.css';
import stylesSidever from '../../components/Sidebar/LeftSidebar.module.css';


//type
import { Entry,EntryAC, EntrySports } from '../../components/type'; 


//Image
import logo from '../../public/logo2.png';
import Title01 from '../../public/Title01.png';
import Title02 from '../../public/Title02.png';
import Title03 from '../../public/Title03.png';
import Title04 from '../../public/Title04.png';
import piyo01 from '../../public/piyo01.png'
import piyo02 from '../../public/piyo02.png'
import piyo03 from '../../public/piyo03.png'
import piyo04 from '../../public/piyo04.png'
import piyo05 from '../../public/piyo05.png'
import piyo06 from '../../public/piyo06.png'
import kaunt from '../../public/kaunt1.png'
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
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);


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


const handleNewTip = () => {
  setTip(getRandomTip());
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
    <div className={styles.body}>
      <div className={styles.fullbackContent}>

        {/* レフトサイドバー */}
        <aside className={stylesSidever.sidebar}>
          <Image src={logo} alt="Open Modal" width={200} />
          <div>
            <LeftSidebar/>
          </div>
          <div className={stylesSidever.imageContainer}>         
            <CountDisplay entries={entries} />
          </div>
        </aside>

        {/* メインコンテンツ */}
        <div className={styles.mainbackContent}>
          <div className={styles.mainContent}>
              <div className={styles.piyoback}>          
                <button onClick={handleNewTip} style={{ padding: '10px', fontSize: '16px', marginLeft: '20px' }}>
                  <Image src={currentImage} alt="Piyo image" className={styles.piyo}></Image>
                </button>
                <div className={styles.container}>
                  <div className={styles.piyoime}>
                  <Image src={kaunt} alt="Sample image" width={600} />
                  <div className={styles.tipback}><div className={styles.tip}>{tip}</div></div>
                  </div>
                </div>
              </div>

            {/*Title01*/}
            <div className={styles.titleback}>
              <Image src={Title01} alt="Title_goal" className={styles.titleImage}/>
            </div>

            {/*目標カード*/}
            <div className={styles.goalback}>
              <CardGoal
              latestEntryAC={latestEntryAC}
              latestEntry={latestEntrytoGOAL}
              /> 
            </div>

            {/*Title02*/}
            <div className={styles.titleback}>
              <Image src={Title02} alt="Title_BodyComposition" className={styles.titleImage}/>
            </div>
              {/* グラフ表示*/}
            <div className={styles.AnalysisBack}>
              <div className={styles.ChartsBack}>
                <Charts_Dounut
                    entries={entries}
                    latestEntry={latestEntry}
                    bodyFatPercentage={bodyFatPercentage}
                  />
              </div>
              <div className={styles.ChartsBack}>
                <CardNow
                latestEntry={latestEntry}
                previousEntry={previousEntry}
                />
              </div>
            </div>
            
            {/*Title03*/}
            <div className={styles.titleback}>
              <Image src={Title03} alt="Title_Histry" className={styles.titleImage}/>
            </div>
            <div className={styles.ChartsLineBack}>
              <Charts_Line
                entries={entries}
                latestEntry={latestEntry}
                bodyFatPercentage={bodyFatPercentage}
              />
            </div>
            
            {/*Title04*/}
            <div className={styles.titleback}>
              <Image src={Title04} alt="Title_List" className={styles.titleImage}/>
            </div>


            {/* データテーブル表示 */}
            <div className={styles.ChartsLineBack}>
            <Datatable_UI 
                entries={entries} 
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
              
          </div>
          {/* 右側のサイドバー（カレンダー） */}
          <div className={styles.sidebarRight}>
            <RightSidebar sportsEntries={sportsEntries} />
          </div>
        </div>

      
      
      </div>
    </div>
    
  );
}
