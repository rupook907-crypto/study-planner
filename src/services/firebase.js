
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoYOSjqF8tUzmUD_SfSyvRkeGm30TxLGc",
  authDomain: "study-planner-911d9.firebaseapp.com",
  projectId: "study-planner-911d9",
  storageBucket: "study-planner-911d9.firebasestorage.app",
  messagingSenderId: "756161315436",
  appId: "1:756161315436:web:35a547ccf07fa36d260e49"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;