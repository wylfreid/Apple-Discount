import { initializeApp } from "firebase/app";

import {getAuth} from 'firebase/auth'

import {getFirestore} from 'firebase/firestore'

import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAm-FXMvlzN4WEMHoSC8_seEMyIx6QCwQk",
  authDomain: "apple-discount.firebaseapp.com",
  projectId: "apple-discount",
  storageBucket: "apple-discount.appspot.com",
  messagingSenderId: "348756496849",
  appId: "1:348756496849:web:b208c9cd82edd273cfd0f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
