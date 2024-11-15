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
import CountDisplay from '../components/Sidebar/Countdisplay';
import TextInputModal from '../components/Modal/TextInput_UI' ; 
import TextfromIMAGEModal from '../components/Modal/TextfromIMAGE_UI' ; 
import AuthModal from '../components/Modal/AuthModal';
import NicknameModal from '../components/Modal/Nickname'
import LogoutModal from '../components/Modal/LogoutModal';
import CalendarModal from '../components/Modal/CalenderModal'
import CheerModal from '../components/Modal/CheerModal';
import ProfileModal from '../components/Modal/ProfileModal';
import { getRandomTip } from '../components/Tip/GetRandomTip'; // 関数をインポート

// Firebase
import { auth, db} from '../../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { saveEntryACToFirestore, getEntriesFromFirestore, getEntryACNFromFirestore,getEntryACFromFirestore, getEntrySportsFromFirestore, getCountEntriesFromFirestore} from "../../firebase/saveDataFunctions";

//style
import styles from '../style.module.css';
import local from '../styles/local.module.css'
import stylesSidever from '../components/Sidebar/LeftSidebar.module.css';
import create from './createpage.module.css';


//type
import { Entry,EntryAC, EntrySports } from '../components/type'; 


//Image
import logo from '../public/logo2.png';
import sideBarImageOUT00 from '../public/Sidever_imageOUT000.png';
import sideBarImage00 from '../public/Sidever_image000.png';
import sideBarImage01 from '../public/Sidever_image001a.png';
import sideBarImage02 from '../public/Sidever_image002.png';
import sideBarImage03 from '../public/Sidever_image003.png';
import sideBarImage04 from '../public/Sidever_image004.png';
import icon01 from '../public/icon1.png';
import icon02 from '../public/icon2.png';
import icon03 from '../public/icon3.png';
import icon04 from '../public/icon4.png';
import piyo03 from '../public/piyo03.png';
import kaunt from '../public/kaunt1.png';

import Pro1 from '../public/Pro1.png';
import Pro2 from '../public/Pro2.png';

import save from '../public/save.png';
import edit from '../public/edit.png';
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
      }
    };
    fetchData();
  }, [auth.currentUser]);
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
    <div className={local.body}>
      <div className={local.fullbackContent}>
      {/* レフトサイドバー */}
      <aside className={stylesSidever.sidebar}>
      <Image src={logo} alt="Open Modal" width={200} />
        <div className={local.sidebarA}>
        
        {isLoggedIn ? (
          <button onClick={() => setIsLogoutModalOpen(true)} className={stylesSidever.sidebarButton}>
            <div className={stylesSidever.buttonContent}>
              <Image src={sideBarImageOUT00} alt="Open Modal" width={150} />
            </div>
          </button>
        ) : (
          <button onClick={() => setIsSignUpModalOpen(true)} className={stylesSidever.sidebarButton}>
            <div className={stylesSidever.buttonContent}>
              <Image src={sideBarImage00}  alt="Open Modal" width={150} />
            </div>
          </button>
        )}

        <button onClick={() => setIsTextInputModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage01} alt="Open Modal" width={150} />
          </div>
        </button>

        <button onClick={() => setIsImageInputModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage02} alt="Open Modal" width={150} />
          </div>
        </button>

        <button onClick={() => setIsNicknameModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage03} alt="Open Modal" width={150} />
          </div>
        </button>

        <button onClick={() => setIsCalendarModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage04} alt="Open Modal" width={150} />
          </div>
        </button>

        <button onClick={() => setIsProfileModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage04} alt="Open Modal" width={150} />
          </div>
        </button>
        
        </div>
        <div className={stylesSidever.imageContainer}>         
          <CountDisplay entries={entries} />
        </div>
      </aside>




      {/* メインコンテンツ */}
      <div className={local.mainbackContent2}>
        <div className={local.mainContent2}>
          {/*title*/}
          <div className={create.title}>
            <Image src={Pro1} alt='TitleImage' width={400}></Image>
          </div>
            {/*profile上*/}              
              {entryAC ? (   
                <>
                  <div className={create.proueback}>

                    <div className={create.piyoback}>
                      <Image src={piyo03} alt="Sample image" width={250} />
                    </div>

                    <div className={create.protext}>
                      {/* Nickname */}
                      <div className={create.nicknameback}>
                        {editingField === 'nickname' ? (
                          <>
                            <input type="text" value={entryAC.nickname} 
                              onChange={(e) => handleChange('nickname', e.target.value)} 
                              className={create.nicknameInput}
                            />
                            <button onClick={handleSave} className={create.saveButton}>
                              <Image src={save} alt='save' height={30}></Image>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className={create.nicknameText}>{entryAC.nickname}</span>
                            <button onClick={() => handleEdit('nickname')} className={create.editButton}>
                              <Image src={edit} alt='save' height={30}></Image>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Goal Weight */}
                      <div className="mb-4">
                        <strong>Goal Weight:</strong>
                        {editingField === 'goalWeight' ? (
                          <>
                            <input 
                              type="number" 
                              value={entryAC.goalWeight} 
                              onChange={(e) => handleChange('goalWeight', e.target.value)} 
                            />
                            <button onClick={handleSave} className={styles.modalButton}>Save</button>
                          </>
                        ) : (
                          <>
                            <span>{entryAC.goalWeight} kg</span>
                            <button onClick={() => handleEdit('goalWeight')} className={styles.modalButton}>Edit</button>
                          </>
                        )}
                      </div>

                      {/* Goal Fat */}
                      <div className="mb-4">
                        <strong>Goal Fat:</strong>
                        {editingField === 'goalFat' ? (
                          <>
                            <input 
                              type="number" 
                              value={entryAC.goalFat} 
                              onChange={(e) => handleChange('goalFat', e.target.value)} 
                            />
                            <button onClick={handleSave} className={styles.modalButton}>Save</button>
                          </>
                        ) : (
                          <>
                            <span>{entryAC.goalFat}%</span>
                            <button onClick={() => handleEdit('goalFat')} className={styles.modalButton}>Edit</button>
                          </>
                        )}
                      </div>

                      {/* Goal Muscle */}
                      <div className="mb-4">
                        <strong>Goal Muscle:</strong>
                        {editingField === 'goalMuscle' ? (
                          <>
                            <input 
                              type="number" 
                              value={entryAC.goalMuscle} 
                              onChange={(e) => handleChange('goalMuscle', e.target.value)} 
                            />
                            <button onClick={handleSave} className={styles.modalButton}>Save</button>
                          </>
                        ) : (
                          <>
                            <span>{entryAC.goalMuscle} kg</span>
                            <button onClick={() => handleEdit('goalMuscle')} className={styles.modalButton}>Edit</button>
                          </>
                        )}
                      </div>

                      {/* Height */}
                      <div className="mb-4">
                        <strong>Height:</strong>
                        {editingField === 'height' ? (
                          <>
                            <input 
                              type="number" 
                              value={entryAC.height} 
                              onChange={(e) => handleChange('height', e.target.value)} 
                            />
                            <button onClick={handleSave} className={styles.modalButton}>Save</button>
                          </>
                        ) : (
                          <>
                            <span>{entryAC.height} cm</span>
                            <button onClick={() => handleEdit('height')} className={styles.modalButton}>Edit</button>
                          </>
                        )}
                      </div>

                      {/* Sex */}
                      <div className="mb-4">
                        <strong>Sex:</strong>
                        {editingField === 'sex' ? (
                          <>
                            <select 
                              value={entryAC.sex} 
                              onChange={(e) => handleChange('sex', e.target.value)} 
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            <button onClick={handleSave} className={styles.modalButton}>Save</button>
                          </>
                        ) : (
                          <>
                            <span>{entryAC.sex}</span>
                            <button onClick={() => handleEdit('sex')} className={styles.modalButton}>Edit</button>
                          </>
                        )}
                      </div>

                      {/* 目標体重の目安 */}
                      <div className="mb-4">
                        <h3>あなたの目標体重の目安</h3>
                        <button 
                          onClick={calculateTargets} 
                          className={styles.modalButton} 
                          disabled={!entryAC.height || !entryAC.sex}
                        >
                          計算する
                        </button>
                        {calculatedWeight && calculatedFat && calculatedLean && (
                          <div>
                            <p><strong>標準体重：</strong>{calculatedWeight.toFixed(2)} kg</p>
                            <p><strong>標準体脂肪量：</strong>{calculatedFat.toFixed(2)} kg</p>
                            <p><strong>標準除脂肪量：</strong>{calculatedLean.toFixed(2)} kg</p>
                          </div>
                        )}
                      </div>
                      </div>
                      </div>
                    </>
                  ) : (
                    <p>No profile data available. Please set up your profile.</p>
                  
               )}
                
           
            
          <Link href='/'>Home</Link>

          
        </div>
        
      </div>
      
      </div>
    </div>
    
  );
}
