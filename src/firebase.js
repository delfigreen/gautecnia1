import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBxc2utiv-72cJCzt8fYjA5Fkoy5TayoNY",
    authDomain: "gautecnia-dd2be.firebaseapp.com",
    databaseURL: "https://gautecnia-dd2be-default-rtdb.firebaseio.com",
    projectId: "gautecnia-dd2be",
    storageBucket: "gautecnia-dd2be.appspot.com",
    messagingSenderId: "344204870400",
    appId: "1:344204870400:web:8fd65259d9175f51bd29e5",
    measurementId: "G-BFQ62PXWCG"
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  
  export { db, auth, storage };