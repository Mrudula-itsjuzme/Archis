import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDafOu3NXfi4GzzInRCNwie2ZdrH2ufAV8",
  authDomain: "archis-18591.firebaseapp.com",
  projectId: "archis-18591",
  storageBucket: "archis-18591.firebasestorage.app",
  messagingSenderId: "856185232387",
  appId: "1:856185232387:web:e6d5cb8bb9393bff638236",
  measurementId: "G-G9QJ4M8VHD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
