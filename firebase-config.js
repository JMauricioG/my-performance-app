// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZqNWzvX-O9fYvFWqaem-7WJ2DKzooxiw",
  authDomain: "my-performance-e6adb.firebaseapp.com",
  projectId: "my-performance-e6adb",
  storageBucket: "my-performance-e6adb.firebasestorage.app",
  messagingSenderId: "84323924220",
  appId: "1:84323924220:web:58a6865ab78d79a541ff79",
  measurementId: "G-RJHC5FJPVV",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
