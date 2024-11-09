import { db, auth } from './firebase'; // Firebaseの設定をインポート
import { doc, setDoc, getDoc, arrayUnion,collection,getDocs } from 'firebase/firestore';
import { Entry, EntryAC } from '../app/components/type';

// Firebaseにユーザー情報を保存する関数
export const saveUserInfoToFirestore = async (userInfo: {
  nickname: string;
  icon: string;
  height: string;
  sex: string;
  goalWeight: string;
  goalFat: string;
  goalMuscle: string;
}) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('ユーザーがログインしていません');
  }

  try {
    const userDocRef = doc(db, 'userProfiles', user.uid);

    // ユーザー情報をFirestoreに保存
    await setDoc(userDocRef, userInfo, { merge: true });
    console.log('User information successfully saved to Firestore');
  } catch (error) {
    console.error('Error saving user information to Firestore:', error);
    throw new Error('ユーザー情報の保存中にエラーが発生しました。');
  }
};

// Firestoreからユーザー情報を取得する関数
export const fetchUserInfoFromFirestore = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('ユーザーがログインしていません');
  }

  try {
    const userDocRef = doc(db, 'userProfiles', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data;
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw new Error('ユーザー情報の取得中にエラーが発生しました。');
  }
};

// Firestoreにエントリー情報を保存する関数
export const saveEntryToFirestore = async (entry: Entry) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('ユーザーがログインしていません');
  }

  try {
    const userDocRef = doc(db, 'userEntries', user.uid);

    // エントリー情報をFirestoreに保存
    await setDoc(
      userDocRef,
      {
        entries: arrayUnion(entry),
      },
      { merge: true }
    );
    console.log('Entry successfully saved to Firestore');
  } catch (error) {
    console.error('Error saving entry to Firestore:', error);
    throw new Error('データの保存中にエラーが発生しました。');
  }
};

// EntryACデータをFirestoreに保存する関数
export const saveEntryACToFirestore = async (entryAC: EntryAC) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "userEntries", user.uid);
        const entryACCollectionRef = collection(userDocRef, "entryAC");
        const newEntryACDocRef = doc(entryACCollectionRef, entryAC.id);
        await setDoc(newEntryACDocRef, entryAC);
        console.log("EntryAC data successfully written to Firestore");
      } else {
        alert("ユーザーがログインしていません。");
      }
    } catch (error) {
      console.error("Error writing entryAC to Firestore:", error);
      alert("データ保存中にエラーが発生しました。");
    }
  };

// Firestoreからユーザーのエントリーを取得する関数
export const getEntriesFromFirestore = async (setEntries: React.Dispatch<React.SetStateAction<Entry[]>>) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'userEntries', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEntries(data.entries || []);
          console.log('User data fetched successfully:', data);
        } else {
          console.log('No user data found');
        }
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
      alert('データの取得中にエラーが発生しました。');
    }
  };

// EntryACデータを取得する関数
export const getEntryACFromFirestore = async (setEntryAC: React.Dispatch<React.SetStateAction<EntryAC[]>>) => {
     try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'userProfiles', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setEntryAC(data.entryAC || []);
            console.log('User data fetched successfully:', data);
          } else {
            console.log('No user data found');
          }
        }
      } catch (error) {
          console.error('Error fetching data from Firestore:', error);
          alert('データの取得中にエラーが発生しました。');
        }
      };