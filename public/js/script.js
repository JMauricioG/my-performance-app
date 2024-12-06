import {
  registerUser,
  loginUser,
  logoutUser,
  submitPerformanceData,
  loginWithGoogle,
} from "../../firebase-auth.js";
import { auth } from "../../firebase-config.js";

// DOM Elements
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const appContainer = document.getElementById("app-container");
const errorMessage = document.getElementById("error-message");
const registerErrorMessage = document.getElementById("register-error-message");

// Mostrar el formulario de registro
document.getElementById("show-register").addEventListener("click", () => {
  toggleContainers(registerContainer, loginContainer);
});

// Mostrar el formulario de login
document.getElementById("show-login").addEventListener("click", () => {
  toggleContainers(loginContainer, registerContainer);
});

// Manejar el formulario de login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const user = await loginUser(email, password);
    toggleContainers(appContainer, loginContainer);
    document.getElementById(
      "welcome-message"
    ).textContent = `Welcome, ${user.email}!`;
  } catch (error) {
    displayError(errorMessage, error.message);
  }
});

// Manejar el formulario de registro
document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      await registerUser(email, password);
      alert("Account created successfully! You can now log in.");
      toggleContainers(loginContainer, registerContainer);
    } catch (error) {
      displayError(registerErrorMessage, error.message);
    }
  });

// Manejar inicio de sesión con Google
document
  .getElementById("google-login-button")
  .addEventListener("click", async () => {
    try {
      const user = await loginWithGoogle();
      toggleContainers(appContainer, loginContainer);
      document.getElementById(
        "welcome-message"
      ).textContent = `Welcome, ${user.displayName}!`;
    } catch (error) {
      alert(`Error logging in with Google: ${error.message}`);
    }
  });

// Logout
document.getElementById("logout-button").addEventListener("click", async () => {
  try {
    await logoutUser();
    toggleContainers(loginContainer, appContainer);
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

/**
 * Cambia entre dos contenedores visibles
 * @param {HTMLElement} showContainer - Contenedor a mostrar
 * @param {HTMLElement} hideContainer - Contenedor a ocultar
 */
function toggleContainers(showContainer, hideContainer) {
  hideContainer.classList.add("hidden");
  showContainer.classList.remove("hidden");
}

/**
 * Muestra un mensaje de error en el contenedor especificado
 * @param {HTMLElement} errorElement - Contenedor del mensaje de error
 * @param {string} message - Mensaje de error a mostrar
 */
function displayError(errorElement, message) {
  errorElement.textContent = `Error: ${message}`;
  errorElement.classList.remove("hidden");
}
