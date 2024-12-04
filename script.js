import {
  registerUser,
  loginUser,
  logoutUser,
  submitPerformanceData,
} from "./firebase-auth.js";
import { auth } from "./firebase-config.js";

// DOM Elements
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const appContainer = document.getElementById("app-container");
const errorMessage = document.getElementById("error-message");
const registerErrorMessage = document.getElementById("register-error-message");

// Mostrar formulario de registro
function showRegisterForm() {
  loginContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
}

// Mostrar formulario de login
function showLoginForm() {
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
}

// Manejar formulario de login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const user = await loginUser(email, password);
    loginContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    document.getElementById(
      "welcome-message"
    ).textContent = `Welcome, ${user.email}!`;
  } catch (error) {
    errorMessage.textContent = `Error: ${error.message}`;
    errorMessage.classList.remove("hidden");
  }
});

// Manejar formulario de registro
document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      await registerUser(email, password);
      alert("Account created successfully! You can now log in.");
      showLoginForm();
    } catch (error) {
      registerErrorMessage.textContent = `Error: ${error.message}`;
      registerErrorMessage.classList.remove("hidden");
    }
  });

// Logout
document.getElementById("logout-button").addEventListener("click", async () => {
  try {
    await logoutUser();
    loginContainer.classList.remove("hidden");
    appContainer.classList.add("hidden");
  } catch (error) {
    alert(`Error logging out: ${error.message}`);
  }
});

// Enviar datos de rendimiento
document
  .getElementById("submit-data-button")
  .addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("No user is logged in.");
      return;
    }

    const performanceData = [
      {
        category: "in-possession",
        subcategory: "Movement off the Ball",
        positive: 5,
        negative: 2,
      },
      {
        category: "out-of-possession",
        subcategory: "Tackling",
        positive: 3,
        negative: 1,
      },
    ];

    try {
      await submitPerformanceData(user.uid, performanceData);
      alert("Data submitted successfully!");
    } catch (error) {
      alert(`Error submitting data: ${error.message}`);
    }
  });

// Mostrar el formulario de registro al hacer clic en "Crear Cuenta"
document
  .getElementById("show-register")
  .addEventListener("click", showRegisterForm);

// Mostrar el formulario de login al hacer clic en "Login"
document.getElementById("show-login").addEventListener("click", showLoginForm);
