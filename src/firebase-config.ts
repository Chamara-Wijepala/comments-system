import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhcfS6hOp6UxW2bDk8LxAe39-rW0sEBIE",
  authDomain: "comment-system-2bfd8.firebaseapp.com",
  projectId: "comment-system-2bfd8",
  storageBucket: "comment-system-2bfd8.appspot.com",
  messagingSenderId: "318852952072",
  appId: "1:318852952072:web:d8968bc1a11d892d40e1bd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
