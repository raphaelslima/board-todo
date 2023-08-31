
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBY1xj5GHVNT5ZDe77UQttZJPVXf6Tj_Pg",
  authDomain: "boardtodo-acd47.firebaseapp.com",
  projectId: "boardtodo-acd47",
  storageBucket: "boardtodo-acd47.appspot.com",
  messagingSenderId: "710425247732",
  appId: "1:710425247732:web:ba95e59b6b904e973283a1"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db }