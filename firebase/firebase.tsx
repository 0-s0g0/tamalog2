// Firebaseインスタンスを初期化する部分
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // 認証を使うためにインポート
import { getFirestore } from 'firebase/firestore';  // Firestoreを使うためにインポート
import { getStorage } from 'firebase/storage';  // Storageを使うためにインポート




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA09ElrTSgZxpiWu8ucKe1FT77ms0GewA",
  authDomain: "kanriapp-1c4c2.firebaseapp.com",
  projectId: "kanriapp-1c4c2",
  storageBucket: "kanriapp-1c4c2.firebasestorage.app",
  messagingSenderId: "1006611130290",
  appId: "1:1006611130290:web:8c47896949ed6dbb1ee6ab"
};


// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firebase Authenticationインスタンスを取得
export const auth = getAuth(app);

// Firestoreインスタンスを取得
export const db = getFirestore(app);

// Firebase Storageインスタンスを取得
export const storage = getStorage(app);