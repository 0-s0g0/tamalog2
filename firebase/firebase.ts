// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA09ElrTSgZxpiWu8ucKe1FT77ms0GewA",
  authDomain: "kanriapp-1c4c2.firebaseapp.com",
  projectId: "kanriapp-1c4c2",
  storageBucket: "kanriapp-1c4c2.firebasestorage.app",
  messagingSenderId: "1006611130290",
  appId: "1:1006611130290:web:8c47896949ed6dbb1ee6ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { auth };