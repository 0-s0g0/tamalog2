"use client";
///////////////////////////////////////////
// 1. 外部ライブラリのインポート
///////////////////////////////////////////
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

//copmponentsのインポート
import ChartsUI from './components/charts_UI';  
import Datatable_UI from './components/Datatable_UI'; 
import TextInputModal from './components/Modal/TextInput_UI' ; 
import TextfromIMAGEModal from './components/Modal/TextfromIMAGE_UI' ; 
import { fetchEntriesFromFirestore } from './components/Modal/TextInput_UI' ; 



// Firebase関連のインポート
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

///////////////////////////////////////////
// 2. スタイルと画像のインポート
///////////////////////////////////////////
import styles from './style.module.css';
import sample_img from './public/image01.png';
import sideBarImage00 from './public/Sidever_image00.png';
import sideBarImage01 from './public/Sidever_image01.png';
import sideBarImage02 from './public/Sidever_image02.png';
import sideBarImage03 from './public/Sidever_image03.png';
import icon01 from './public/icon1.png';
import icon02 from './public/icon2.png';
import icon03 from './public/icon3.png';
import icon04 from './public/icon4.png';
import { text } from 'node:stream/consumers';




///////////////////////////////////////////
// 3. 型定義
///////////////////////////////////////////
interface Entry {
  id: string;
  date: string;
  bodyWater: string;
  protein: string;
  minerals: string;
  bodyFat: string;
  totalWeight: number;
}

///////////////////////////////////////////
// 4. メインコンポーネント
///////////////////////////////////////////
export default function Home() {
  ///////////////////////////////////////////
  // 5. ステート管理
  ///////////////////////////////////////////
  // データ関連のstate
  const [entries, setEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState('');
  const [bodyWater, setBodyWater] = useState('');
  const [protein, setProtein] = useState('');
  const [minerals, setMinerals] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  // モーダル制御のstate
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextInputModalOpen, setIsTextInputModalOpen] = useState(false);
  const [isImageInputModalOpen, setIsImageInputModalOpen] = useState(false);
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  // 画像関連のstate

  const [detectedNumbers, setDetectedNumbers] = useState([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageProcessingResults, setImageProcessingResults] = useState<number[]>([]);


  // 認証関連のstate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [nickname, setNickname] = useState('');
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  // アイコンの選択
  const icons = [icon01, icon02, icon03, icon04];
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null); // 選択されたアイコンのインデックス
  const [goalWeight, setGoalWeight] = useState<string>('');
  const [goalFat, setGoalFat] = useState<string>('');
  const [goalMuscle, setGoalMuscle] = useState<string>('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  ///////////////////////////////////////////
  // 6. データフェッチと副作用
  ///////////////////////////////////////////
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
        await fetchEntriesFromFirestore(setEntries);
      }
    };
    fetchData();
  }, [auth.currentUser]);

  ///////////////////////////////////////////
  // 7. ユーティリティ関数
  ///////////////////////////////////////////
  // 変化量を計算する関数
  const calculateChange = (latest: string, previous: string) => {
    const latestValue = parseFloat(latest);
    const previousValue = parseFloat(previous);
    const change = latestValue - previousValue;

    if (change > 0) {
      return { change: change.toFixed(2), sign: <span className={styles.changeINIndicator}>▲+</span>, color: 'increase' };
    } else if (change < 0) {
      return { change: (-change).toFixed(2), sign: <span className={styles.changeOUTIndicator}>▼-</span>, color: 'decrease' };
    } else {
      return { change: '--', sign: '', color: 'noChange' };
    }
  };

  // 体脂肪率の計算
  const calculateBodyFatPercentage = (bodyFat: number, totalWeight: number) => {
    if (totalWeight === 0) return 0;
    return (bodyFat / totalWeight) * 100;
  };

  ///////////////////////////////////////////
// 8. イベントハンドラー
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

// 認証関連ハンドラー（ログイン/サインアップ）
const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // フォーム送信時にページ遷移を防ぐ
  try {
    if (isLoginMode) {
      // ログインモードであれば、ログイン処理を実行
      await signInWithEmailAndPassword(auth, email, password);
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

// ニックネームフォーム送信処理
const handleNicknameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // フォーム送信時にページ遷移を防ぐ
  console.log('Nickname:', nickname); // ニックネームをコンソールに出力（保存処理が必要な場合）
};

// ニックネームモーダルを閉じる
const handleCloseNicknameModal = () => {
  setIsNicknameModalOpen(false); // ニックネーム設定モーダルを閉じる
  setIsSignupSuccess(false); // サインアップ成功のフラグをリセット
};

// アイコン選択ハンドラー
const handleIconSelect = (index: number) => {
  // 選択したアイコンのインデックスを保存（選択したアイコンのスタイル変更用）
  setSelectedIcon(index); 
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
  // 9. データの加工と計算
  ///////////////////////////////////////////
  // 最新のエントリーと前回のエントリーを取得
  const latestEntry = entries[entries.length - 1] || {
    bodyWater: '0',
    protein: '0',
    minerals: '0',
    bodyFat: '0'
  };

  const previousEntry = entries[entries.length - 2] || {
    bodyWater: '0',
    protein: '0',
    minerals: '0',
    bodyFat: '0'
  };

  // 各項目の変化量を計算
  const bodyWaterChange = calculateChange(latestEntry.bodyWater, previousEntry.bodyWater);
  const proteinChange = calculateChange(latestEntry.protein, previousEntry.protein);
  const mineralsChange = calculateChange(latestEntry.minerals, previousEntry.minerals);
  const bodyFatPercentage = calculateBodyFatPercentage(parseFloat(latestEntry.bodyFat), latestEntry.totalWeight);

  ///////////////////////////////////////////
  // UIレンダリング
  ///////////////////////////////////////////
  return (
    <div style={{ backgroundColor: '#EFF4FB', display: 'flex' }} className="flex">
      {/* サイドバー */}
      <aside className={styles.sidebar}>
        <button onClick={() => setIsSignUpModalOpen(true)} className={styles.sidebarButton}>
          <Image
            src={sideBarImage00}
            alt="Open Modal"
            width={50} // 画像の幅を設定
            height={50} // 画像の高さを設定
          />
        </button>
        <button onClick={() => setIsTextInputModalOpen(true)} className={styles.sidebarButton}>
          <Image
            src={sideBarImage01}
            alt="Open Modal"
            width={50} // 画像の幅を設定
            height={50} // 画像の高さを設定
          />
        </button>
        <button onClick={() => setIsImageInputModalOpen(true)} className={styles.sidebarButton}>
          <Image
            src={sideBarImage02}
            alt="Open Modal"
            width={50} // 画像の幅を設定
            height={50} // 画像の高さを設定
          />
        </button>
        <button onClick={() => setIsNicknameModalOpen(true)} className={styles.sidebarButton}>
          <Image
            src={sideBarImage03}
            alt="Open Modal"
            width={50} // 画像の幅を設定
            height={50} // 画像の高さを設定
          />
        </button>
      </aside>

      {/* メインコンテンツ */}
      <div className="flex-1 p-24">
        <h1 className="text-2xl font-bold mb-4">Home Page!</h1>
        <Link href='/create-post'>Move Create Post Page</Link>
        <Image
          src={sample_img}
          alt="Sample image"
          width={200}
          height={300}
        />

        {/* メトリクスカード */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Water</div>
            <div className={styles.metricValue}>
              {parseFloat(latestEntry.bodyWater).toFixed(2)} kg
            </div>
            <span className={`${styles.changeIndicator} ${bodyWaterChange.color}`}>
              {bodyWaterChange.sign}{bodyWaterChange.change} kg
            </span>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Protein</div>
            <div className={styles.metricValue}>
              {parseFloat(latestEntry.protein).toFixed(2)} kg
            </div>
            <span className={`${styles.changeIndicator} ${proteinChange.color}`}>
              {proteinChange.sign}{proteinChange.change} kg
            </span>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Minerals</div>
            <div className={styles.metricValue}>
              {parseFloat(latestEntry.minerals).toFixed(2)} kg
            </div>
            <span className={`${styles.changeIndicator} ${mineralsChange.color}`}>
              {mineralsChange.sign}{mineralsChange.change} kg
            </span>
          </div>
        </div>


        {/* グラフ表示*/}
        {/*{entries.length > 0 && latestEntry && ()}の中にいれると初期画面に表示させない*/}
        <ChartsUI
            entries={entries}
            latestEntry={latestEntry}
            bodyFatPercentage={bodyFatPercentage}
          />

        {/* データテーブル表示 */}
        <Datatable_UI 
            entries={entries} 
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          
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

      {/* ログインまたはサインアップ後のニックネーム設定モーダル */}
      {isNicknameModalOpen && (
        <div className={styles.modalBackground}>
        <div className={styles.modalContent}>
          <h2 className="text-xl font-bold mb-4">My Account</h2>
          <form onSubmit={handleNicknameSubmit}>
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

            {/* プロフィール画像選択 */}
            <div className="mb-4">
              <label className="block mb-1">プロフィール画像を選択:</label>
              <div className="flex space-x-4">
                {icons.map((icon, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 rounded-full cursor-pointer ${
                      selectedIcon === index ? 'border-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleIconSelect(index)} // indexの型がnumberであることを明示
                  >
                    <img
                      src={icon.src} // icon.src を使って画像パスを取得
                      alt={`Icon ${index + 1}`}
                      className={`w-full h-full object-cover rounded-full ${
                        selectedIcon !== index ? 'opacity-50' : 'opacity-100'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 横棒 */}
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
              <button type="submit" className={styles.modalButton}>Submit</button>

              {/* モーダルを閉じるボタン */}
              <button type="button" onClick={handleCloseNicknameModal} className={styles.modalButtonclose} >Close</button>

              {/* ログアウトボタン */}
              <button type="button" onClick={handleLogout} className={styles.modalButtonclose} >log out</button>

            </form>
          </div>
        </div>
      )}

      {/* 既存のログイン・サインアップモーダル */}
      {isSignUpModalOpen && (
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

                  {/* ログアウトボタン */}
                  <button type="button" onClick={handleLogout} className={styles.modalButtonclose} >log out</button>
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
      )}

    </div>
  );
}
