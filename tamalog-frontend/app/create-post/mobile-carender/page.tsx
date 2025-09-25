"use client";
///////////////////////////////////////////
// import
///////////////////////////////////////////
//main
import { useState, useEffect } from 'react';


import Header4 from '../../components/Header/Header4';
import RightSidebar2 from '../../components/Sidebar/RightSidebaer2';


// Firebase
import { auth, db} from '../../../firebase/firebase';
import { saveEntryACToFirestore, getEntriesFromFirestore, getEntryACNFromFirestore,getEntryACFromFirestore, getEntrySportsFromFirestore, getCountEntriesFromFirestore} from "../../../firebase/saveDataFunctions";

//style
import styles from './../../styles/main.module.css';
import create from './mobile-calender.module.css';


//type
import { Entry,EntryAC, EntrySports } from '../../components/type'; 


//Image
import piyo01 from '../../public/piyo01.png'
import piyo02 from '../../public/piyo02.png'
import piyo03 from '../../public/piyo03.png'
import piyo04 from '../../public/piyo04.png'
import piyo05 from '../../public/piyo05.png'
import piyo06 from '../../public/piyo06.png'
import kaunt from '../../public/kaunt1.png';
///////////////////////////////////////////
// メインコンポーネント
///////////////////////////////////////////
export default function Home() {
  ///////////////////////////////////////////
  // ステート管理
  ///////////////////////////////////////////
  // データ関連
  const [entries, setEntries] = useState<Entry[]>([]);
  const [entryAC, setEntryAC] = useState<EntryAC | null>(null);
    const [sportsEntries, setSportsEntries] = useState<EntrySports[]>([]); 

  // 認証関連のstate
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [editingField, setEditingField] = useState<keyof EntryAC | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);
  const [calculatedFat, setCalculatedFat] = useState<number | null>(null);
  const [calculatedLean, setCalculatedLean] = useState<number | null>(null);

  ///////////////////////////////////////////
  // レンダリング時の処理
  ///////////////////////////////////////////
  //API
  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        await getEntryACNFromFirestore(setEntryAC);
        await getCountEntriesFromFirestore(setEntries);
        await getEntrySportsFromFirestore(setSportsEntries);
      }
    };
    fetchData();
  }, [auth.currentUser]);

    // ログイン状態の監視
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsLoggedIn(!!user);  // ユーザーがログインしていればtrue、ログインしていなければfalse
      });
  
      return () => unsubscribe();  // コンポーネントがアンマウントされた際に監視を解除
    }, []);

  ///////////////////////////////////////////
  // イベントハンドラー
  ///////////////////////////////////////////
const handleSave = async () => {
  if (entryAC) {
    await saveEntryACToFirestore(entryAC); // Firestoreにデータを保存
    setEditingField(null); // 保存後、編集モードを終了
  }
};

const handleChange = (field: keyof EntryAC, value: string) => {
  if (entryAC) {
    setEntryAC({ ...entryAC, [field]: value });
  }
};

const handleEdit = (field: keyof EntryAC) => {
  setEditingField(field); // 編集モードに切り替え
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

// 計算処理
const calculateTargets = () => {
  if (entryAC?.height && entryAC?.sex) {
    const heightInMeters = parseFloat(entryAC.height) / 100; // 身長をメートル単位に変換
    const standardBMI = entryAC.sex === 'male' ? 22 : 21;
    const idealFatRate = entryAC.sex === 'male' ? 0.15 : 0.23;
    const idealLeanRate = entryAC.sex === 'male' ? 0.85 : 0.77;

    // 標準体重 = 身長(m) × 身長(m) × 標準BMI
    const standardWeight = heightInMeters * heightInMeters * standardBMI;

    // 標準体脂肪量 = 標準体重 × 理想体脂肪率
    const standardFat = standardWeight * idealFatRate;

    // 標準除脂肪量 = 標準体重 × 理想除脂肪率
    const standardLean = standardWeight * idealLeanRate;

    setCalculatedWeight(standardWeight);
    setCalculatedFat(standardFat);
    setCalculatedLean(standardLean);
  }
};

  ///////////////////////////////////////////
  // UIレンダリング
  ///////////////////////////////////////////
  return (
    <div className={styles.body}>
    <Header4 />
      <div className={create.fullbackContent}>
      <RightSidebar2 sportsEntries={sportsEntries} />
      
      </div>
    </div>
    
  );
}
