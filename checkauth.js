import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCW9kzlx94qJWkpphG3kGmVskHezLf6Bb0",
  authDomain: "rotorbus-ae2a5.firebaseapp.com",
  projectId: "rotorbus-ae2a5",
  appId: "1:363736805548:web:590cec31bb5671e115af09",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const allowedPosts =
  (typeof pageAccess !== "undefined") ? pageAccess : null;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    const redirect = encodeURIComponent(window.location.href);
    window.location.replace(
      `https://dashboard.rotorprov.ru/login.html?redirect=${redirect}`
    );
    return;
  }

  if (!allowedPosts) return;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists()) {
    window.location.replace("https://auth.rotorprov.ru/no-access.html");
    return;
  }

  const post = (snap.data().post || "").toLowerCase();

  if (!allowedPosts.includes(post)) {
    console.warn("NO ACCESS:", post, allowedPosts);
    return;
  }

});

/* ===== LOGOUT ===== */
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("https://auth.rotorprov.ru/login.html");
});
