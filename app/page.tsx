//保存できた_画像のフォームまで作った

"use client";

///////////////////////////////////////////
// 必要なライブラリとコンポーネントのインポート
///////////////////////////////////////////
import Link from 'next/link';
import Image from 'next/image';
import sample_img from './public/image01.png';
import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from './style.module.css';
//firebase
import { auth } from '../firebase/firebase'; // firebase.jsのパスに合わせて変更
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



// Chart.jsの必要なコンポーネントを登録
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

////////////////////////////////////////////
//画像のインポート
////////////////////////////////////////////
import sideBarImage00 from './public/Sidever_image00.png';
import sideBarImage01 from './public/Sidever_image01.png';
import sideBarImage02 from './public/Sidever_image02.png';
///////////////////////////////////////////
// インターフェース定義
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
// メインコンポーネント
///////////////////////////////////////////
export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState('');
  const [bodyWater, setBodyWater] = useState('');
  const [protein, setProtein] = useState('');
  const [minerals, setMinerals] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isAcountModalOpen, setIsAcountModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedNumbers, setDetectedNumbers] = useState([]);
  //firebase
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true); // ログインモード
  const [nickname, setNickname] = useState('');
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);


  ///////////////////////////////////////////
  // データ取得と保存の副作用
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
  //エントリーを編集するための関数
  const handleEdit = (id: string) => {
    const entryToEdit = entries.find(entry => entry.id === id);
    if (entryToEdit) {
      setDate(entryToEdit.date);
      setBodyWater(entryToEdit.bodyWater);
      setProtein(entryToEdit.protein);
      setMinerals(entryToEdit.minerals);
      setBodyFat(entryToEdit.bodyFat);
      setEditingId(id);
      setIsModalOpen(true);
    }
  };
  //Image用
  const saveImageUrlToFirestore = async (url: string) => {
    const db = getFirestore();
    const entryId = Date.now().toString(); // 新しいエントリーのIDを生成
    
    try {
        await setDoc(doc(db, 'entries', entryId), { imageUrl: url });
        console.log('Image URL saved to Firestore:', url);
    } catch (error) {
        console.error('Error saving image URL to Firestore:', error);
    }
};



  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);

    try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        console.log('Uploaded image available at:', url);

        // 画像のURLをFirestoreに保存
        await saveImageUrlToFirestore(url);

        setIsSecondModalOpen(false);
        setIsModalOpen(true);
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('画像のアップロード中にエラーが発生しました。');
    }
};


// フォーム送信処理
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // フィールドの確認
    if (!date || !bodyWater || !protein || !minerals || !bodyFat) {
        alert('全てのフィールドに入力してください');
        return;
    }

    // 重量の合計を計算
    const totalWeight = parseFloat(bodyWater) + parseFloat(protein) + parseFloat(minerals) + parseFloat(bodyFat);
    const newEntry: Entry = { id: editingId || Date.now().toString(), date, bodyWater, protein, minerals, bodyFat, totalWeight };

    try {
        // 編集または新規作成の処理
        if (editingId) {
            const response = await fetch('/api/post', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry),
            });
            if (!response.ok) {
                throw new Error('Error updating the entry');
            }
            setEntries(entries.map(entry => (entry.id === editingId ? newEntry : entry)));
        } else {
            const response = await fetch('/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry),
            });
            if (!response.ok) {
                throw new Error('Error adding the new entry');
            }
            setEntries([...entries, newEntry]);
        }

        // フォームをリセット
        setDate('');
        setBodyWater('');
        setProtein('');
        setMinerals('');
        setBodyFat('');
        setEditingId(null);
        setIsModalOpen(false);
        setIsSecondModalOpen(false);
        setIsAcountModalOpen(false);
    } catch (error) {
        console.error('Error processing form submission:', error);
        alert('データの処理中にエラーが発生しました。');
    }
};


  // 削除ボタンのハンドラー
  const handleDelete = async (id: string) => {
    if (confirm('本当に削除しますか？')) {
      await fetch('/api/post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  ///////////////////////////////////////////
  //ログイン・サインアップ
  ////////////////////////////////////////
// サインアップ処理
const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    if (isLoginMode) {
      await signInWithEmailAndPassword(auth, email, password);
      alert('ログイン成功');
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsSignupSuccess(true);
      setIsAcountModalOpen(false); // Close the account modal on signup success
      setIsNicknameModalOpen(true); // Open the nickname modal
      alert('アカウント作成成功');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    alert('エラーが発生しました。');
  }
};


  // ニックネームの処理（必要に応じて）
const handleNicknameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ニックネームを保存する処理をここに追加
  console.log('Nickname:', nickname);
  // たとえば、Firestoreにニックネームを保存するなど
};

const handleCloseNicknameModal = () => {
  setIsNicknameModalOpen(false);
  setIsSignupSuccess(false);
};
  ///////////////////////////////////////////
  // データ加工・計算ロジック
  ///////////////////////////////////////////
  // 最新のエントリーと1つ前のエントリーを取得
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

  // 各項目の変化量を計算
  const bodyWaterChange = calculateChange(latestEntry.bodyWater, previousEntry.bodyWater);
  const proteinChange = calculateChange(latestEntry.protein, previousEntry.protein);
  const mineralsChange = calculateChange(latestEntry.minerals, previousEntry.minerals);

  ///////////////////////////////////////////
  // グラフデータの設定
  ///////////////////////////////////////////
  // 折れ線グラフのデータ
  const lineChartData = {
    labels: entries.map(entry => entry.date),
    datasets: [
      {
        label: '体重',
        data: entries.map(entry => entry.totalWeight),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // 体脂肪率の計算
  const calculateBodyFatPercentage = (bodyFat: number, totalWeight: number) => {
    if (totalWeight === 0) return 0;
    return (bodyFat / totalWeight) * 100;
  };

  const bodyFatPercentage = calculateBodyFatPercentage(parseFloat(latestEntry.bodyFat), latestEntry.totalWeight);

  // ドーナツチャートのデータ
  const donutChartData = {
    labels: ['体水分', 'タンパク質', 'ミネラル', '体脂肪'],
    datasets: [
      {
        data: [parseFloat(latestEntry.bodyWater), parseFloat(latestEntry.protein), parseFloat(latestEntry.minerals), parseFloat(latestEntry.bodyFat)],
        backgroundColor: ['#99CCFF', '#9EFFCE', '#FFFF9E', '#FF9E9E'],
        borderWidth: 1,
      },
    ],
  };

  // ドーナツチャートのオプション
  const donutChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} kg`;
          }
        }
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        formatter: (value: number) => value.toFixed(2),
        color: '#fff',
        font: {
          weight: 'bold',
        }
      }
    },
    cutout: '70%',
  };

  ///////////////////////////////////////////
  // UIレンダリング
  ///////////////////////////////////////////
  return (
    <div style={{ backgroundColor: '#f5f5f5', display: 'flex' }} className="flex">
      {/* サイドバー */}
      <aside className={styles.sidebar}>
        <button onClick={() => setIsAcountModalOpen(true)} className={styles.sidebarButton}>
          <Image
            src={sideBarImage00}
            alt="Open Modal"
            width={50} // 画像の幅を設定
            height={50} // 画像の高さを設定
          />
        </button>
        <button onClick={() => setIsModalOpen(true)} className={styles.sidebarButton}>
          <Image
            src={sideBarImage01}
            alt="Open Modal"
            width={50} // 画像の幅を設定
            height={50} // 画像の高さを設定
          />
        </button>
        <button onClick={() => setIsSecondModalOpen(true)} className={styles.sidebarButton}>
          <Image
            src={sideBarImage02}
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

        {/* グラフ表示セクション */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`${styles.graphCard} ${styles.lineChart}`}>
            <div className={styles.graphTitle}>Weight History</div>
            <Line data={lineChartData} />
          </div>
          <div className={`${styles.graphCard} ${styles.donutChart}`}>
            <div className={styles.graphTitle}>Body Composition Analysis</div>
            <Doughnut data={donutChartData} options={donutChartOptions} />
            <div className={styles.donutCenterLabel}>
              {bodyFatPercentage.toFixed(2)}<span className={styles.donutCenterLabel2}>%</span>
            </div>
          </div>
        </div>

        {/* データテーブル */}
        <div className="mt-8">
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>Body Water</th>
                  <th>Protein</th>
                  <th>Mineral</th>
                  <th>Body Fat</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.bodyWater}</td>
                    <td>{entry.protein}</td>
                    <td>{entry.minerals}</td>
                    <td>{entry.bodyFat}</td>
                    <td>{entry.totalWeight.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleEdit(entry.id)} className={styles.actionEditButton}>Edit</button>
                      <button onClick={() => handleDelete(entry.id)} className={styles.actionDeleteButton}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* モーダルフォーム 1 */}
      {isModalOpen && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContent}>
            <h2 className="text-xl font-bold mb-4">Add Data</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Body Water:</label>
                <input
                  type="number"
                  step="any"
                  value={bodyWater}
                  onChange={(e) => setBodyWater(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Protein:</label>
                <input
                  type="number"
                  step="any"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Minerals:</label>
                <input
                  type="number"
                  step="any"
                  value={minerals}
                  onChange={(e) => setMinerals(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Body Fat:</label>
                <input
                  type="number"
                  step="any"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <button type="submit" className={styles.modalButton}>Add</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className={styles.modalButtonclose}>Close</button>
            </form>
          </div>
        </div>
      )}
      {/* モーダルフォーム 2 */}
      {isSecondModalOpen && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContent}>
            <h2 className="text-xl font-bold mb-4">Upload Image</h2>
            <form onSubmit={handleSubmit}>
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
              <button type="button" onClick={() => setIsSecondModalOpen(false)} className={styles.modalButtonclose}>Close</button>
            </form>
          </div>
        </div>
      )}
      {/* サインアップ成功時の表示 */}
        {isSignupSuccess && (
            <div>
                <h2>Welcome to PhysioLog</h2>
                <form onSubmit={handleNicknameSubmit}>
                    <label>
                        ニックネーム:
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )}

        {/* ログインまたはサインアップモーダル */}
        {isSignupSuccess && isNicknameModalOpen && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContent}>
            <h2>Welcome to PhysioLog</h2>
            <form onSubmit={handleNicknameSubmit}>
              <label>
                ニックネーム:
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseNicknameModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* 既存のログイン・サインアップモーダル */}
      {isAcountModalOpen && (
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
        onClick={() => setIsAcountModalOpen(false)}
        className={styles.modalButtonclose}
      >
        閉じる
      </button>
    </div>
  </div>
)}

//////////////////////////////////////
    </div>
  );
}
