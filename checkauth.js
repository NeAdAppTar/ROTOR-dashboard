import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ================== CONFIG ================== */
const firebaseConfig = {
  apiKey: "AIzaSyCW9kzlx94qJWkpphG3kGmVskHezLf6Bb0",
  authDomain: "rotorbus-ae2a5.firebaseapp.com",
  projectId: "rotorbus-ae2a5",
  appId: "1:363736805548:web:590cec31bb5671e115af09",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================== ACCESS ================== */
const allowedPosts =
  (typeof pageAccess !== "undefined") ? pageAccess : null;

/* ================== CHECK ================== */
onAuthStateChanged(auth, async (user) => {

  /* ❌ Не авторизован */
  if (!user) {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.replace(
      `https://auth.rotorprov.ru/?redirect=${redirectUrl}`
    );
    return;
  }

  /* Авторизован, роль не требуется */
  if (allowedPosts === null) {
    localStorage.setItem("userLogin", user.email);
    return;
  }

  try {
    /* Получаем роль из Firestore */
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      window.location.replace(
        "https://auth.rotorprov.ru/no-access.html"
      );
      return;
    }

    const data = snap.data();
    const post = (data.post || "").trim();

    /* ❌ Нет доступа */
    if (!allowedPosts.includes(post)) {
      window.location.replace(
        "https://auth.rotorprov.ru/no-access.html"
      );
      return;
    }

    /* ✅ Всё ок */
    localStorage.setItem("userPost", post);
    localStorage.setItem("userLogin", user.email);

  } catch (err) {
    console.error("Ошибка Firestore:", err);
    window.location.replace(
      "https://auth.rotorprov.ru/no-access.html"
    );
  }
});

