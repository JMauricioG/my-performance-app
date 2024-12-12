// Importar y configurar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZqNWzvX-O9fYvFWqaem-7WJ2DKzooxiw",
  authDomain: "my-performance-e6adb.firebaseapp.com",
  projectId: "my-performance-e6adb",
  storageBucket: "my-performance-e6adb.appspot.com",
  messagingSenderId: "84323924220",
  appId: "1:84323924220:web:58a6865ab78d79a541ff79",
  measurementId: "G-RJHC5FJPVV",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Referencias a elementos del DOM
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const googleSignInButton = document.getElementById("google-signin");
const userStatus = document.getElementById("user-status");

// Registrar nuevo usuario
registerButton.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    userStatus.textContent = `Usuario registrado: ${userCredential.user.email}`;
  } catch (error) {
    userStatus.textContent = `Error al registrar: ${error.message}`;
  }
});

// Iniciar sesión
loginButton.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    userStatus.textContent = `Bienvenido: ${userCredential.user.email}`;
    logoutButton.style.display = "block";
  } catch (error) {
    userStatus.textContent = `Error al iniciar sesión: ${error.message}`;
  }
});

// Cerrar sesión
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    userStatus.textContent = "Sesión cerrada.";
    logoutButton.style.display = "none";
  } catch (error) {
    userStatus.textContent = `Error al cerrar sesión: ${error.message}`;
  }
});

// Iniciar sesión con Google
googleSignInButton.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    userStatus.textContent = `Sesión iniciada con Google: ${result.user.email}`;
    logoutButton.style.display = "block";
  } catch (error) {
    userStatus.textContent = `Error con Google Sign-In: ${error.message}`;
  }
});
