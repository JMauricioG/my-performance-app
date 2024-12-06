// firebase-auth.js
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

// Registro de usuario
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Guardar datos básicos en Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      performance: [],
    });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Inicio de sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Inicio de sesión con Google
export const loginWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar si el usuario ya está en Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await setDoc(
      userRef,
      {
        email: user.email,
        createdAt: new Date(),
        performance: [],
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Enviar datos de rendimiento
export const submitPerformanceData = async (userId, performanceData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      performance: arrayUnion(...performanceData),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
