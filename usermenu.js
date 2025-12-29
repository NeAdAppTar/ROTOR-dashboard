import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ========= FIREBASE ========= */
const firebaseConfig = {
  apiKey: "AIzaSyCW9kzlx94qJWkpphG3kGmVskHezLf6Bb0",
  authDomain: "rotorbus-ae2a5.firebaseapp.com",
  projectId: "rotorbus-ae2a5",
  appId: "1:363736805548:web:590cec31bb5671e115af09",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ========= DOM ========= */
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const themeBtn = document.getElementById("themeBtn");
  const userNameEl = document.getElementById("userName");
  const userPostEl = document.getElementById("userPost");
  const nyBtn = document.getElementById("nyBtn");

  /* ========= AUTH ========= */
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "https://auth.rotorprov.ru/";
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        console.warn("Нет профиля пользователя");
        return;
      }

      const data = snap.data();

      // login — из email
      const login = user.email?.split("@")[0] || "user";

      userNameEl.textContent = login;
      userPostEl.textContent = data.post || "";

    } catch (e) {
      console.error("Ошибка загрузки профиля:", e);
    }
  });

  /* ========= THEME ========= */
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") document.body.classList.add("dark");

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });

  /* ========= SNOW ========= */
  let snowInterval;

  function startSnow() {
    snowInterval = setInterval(() => {
      const snow = document.createElement("div");
      snow.classList.add("snowflake");
      snow.textContent = "❄";
      snow.style.left = Math.random() * window.innerWidth + "px";
      snow.style.fontSize = (Math.random() * 8 + 8) + "px";
      document.body.appendChild(snow);
      setTimeout(() => snow.remove(), 10000);
    }, 200);
  }

  function stopSnow() {
    clearInterval(snowInterval);
    document.querySelectorAll(".snowflake").forEach(s => s.remove());
  }

  if (localStorage.getItem("snow") === "1") {
    document.body.classList.add("ny-mode");
    startSnow();
  }

  nyBtn.addEventListener("click", () => {
    document.body.classList.toggle("ny-mode");
    const enabled = document.body.classList.contains("ny-mode");

    localStorage.setItem("snow", enabled ? "1" : "0");
    enabled ? startSnow() : stopSnow();
  });

  /* ========= LOGOUT ========= */
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth); // 🔥 ВАЖНО
      localStorage.clear();
      window.location.href = "https://auth.rotorprov.ru/";
    } catch (e) {
      console.error("Ошибка выхода:", e);
    }
  });
});
