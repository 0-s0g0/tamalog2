

// Firebaseインスタンスを初期化する部分
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // 認証を使うためにインポート
import { getFirestore } from 'firebase/firestore';  // Firestoreを使うためにインポート
import { getStorage } from 'firebase/storage';  // Storageを使うためにインポート

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firebase Authenticationインスタンスを取得
export const auth = getAuth(app);

// Firestoreインスタンスを取得
export const db = getFirestore(app);

// Firebase Storageインスタンスを取得
export const storage = getStorage(app);