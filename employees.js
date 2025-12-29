import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyCW9kzlx94qJWkpphG3kGmVskHezLf6Bb0",
  authDomain: "rotorbus-ae2a5.firebaseapp.com",
  projectId: "rotorbus-ae2a5",
  appId: "1:363736805548:web:590cec31bb5671e115af09",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ELEMENTS */
const usersBody = document.getElementById("usersBody");
const addBtn = document.getElementById("addBtn");

/* LOAD USERS */
async function loadUsers() {
  usersBody.innerHTML = "";
  const snap = await getDocs(collection(db, "users"));

  snap.forEach(d => {
    const u = d.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.login}</td>
      <td>${u.post}</td>
      <td>${u.account}</td>
      <td>${u.vk}</td>
      <td>${u.disciplinary_actions}</td>
      <td>${u.note}</td>
      <td>
        <button onclick="deleteUser('${d.id}')">🗑</button>
      </td>`;
    usersBody.appendChild(tr);
  });
}

window.deleteUser = async (uid) => {
  if (!confirm("Удалить пользователя?")) return;
  await deleteDoc(doc(db, "users", uid));
  loadUsers();
};

/* ADD USER */
addBtn.onclick = async () => {
  const login = newName.value.trim();
  const password = newPass.value.trim();

  const email = `${login}@rotorprov.ru`;

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, "users", uid), {
    login,
    post: newPost.value,
    account: newAccount.value,
    vk: newVK.value,
    disciplinary_actions: newDA.value,
    note: newNote.value
  });

  loadUsers();
};

loadUsers();
