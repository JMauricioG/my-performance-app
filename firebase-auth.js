// firebase-auth.js
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

/**
 * Registro de usuario con Firebase Authentication y almacenamiento en Firestore.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {object} - Objeto del usuario registrado.
 */
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
      performance: [], // Array vacío para análisis futuros
    });

    return user;
  } catch (error) {
    console.error("Error en el registro de usuario:", error.message);
    throw new Error(`No se pudo registrar: ${error.message}`);
  }
};

/**
 * Inicio de sesión de usuario con Firebase Authentication.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {object} - Objeto del usuario autenticado.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    throw new Error(`No se pudo iniciar sesión: ${error.message}`);
  }
};

/**
 * Inicio de sesión con Google utilizando Firebase Authentication.
 * Crea un nuevo documento en Firestore si el usuario no existe.
 * @returns {object} - Objeto del usuario autenticado.
 */
export const loginWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar si el usuario ya existe en Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        createdAt: new Date(),
        performance: [],
      });
    }

    return user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error.message);
    throw new Error(`No se pudo iniciar sesión con Google: ${error.message}`);
  }
};

/**
 * Cierra la sesión del usuario actual.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Usuario desconectado exitosamente.");
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
    throw new Error("No se pudo cerrar la sesión.");
  }
};

/**
 * Enviar datos de rendimiento al documento del usuario en Firestore.
 * @param {string} userId - ID del usuario en Firebase Authentication.
 * @param {array} performanceData - Array con datos de rendimiento.
 */
export const submitPerformanceData = async (userId, performanceData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      performance: arrayUnion(...performanceData), // Agrega nuevos datos al array existente
    });
    console.log("Datos de rendimiento guardados correctamente.");
  } catch (error) {
    console.error("Error al guardar los datos de rendimiento:", error.message);
    throw new Error("No se pudo guardar los datos de rendimiento.");
  }
};

/**
 * Enviar un correo electrónico para recuperar la contraseña.
 * @param {string} email - Correo electrónico del usuario.
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Correo de recuperación enviado.");
  } catch (error) {
    console.error("Error al enviar correo de recuperación:", error.message);
    throw new Error("No se pudo enviar el correo de recuperación.");
  }
};
