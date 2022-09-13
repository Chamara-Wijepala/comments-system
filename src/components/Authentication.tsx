import { signInWithPopup, signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

import { auth, provider } from "../firebase-config";

export function LogOut() {
  const photo = auth.currentUser?.photoURL;

  return (
    <>
      <img src={photo!} alt="profile picture" className="profile-picture" />
      <button
        className="btn"
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign out
      </button>
    </>
  );
}

export function LogIn() {
  return (
    <button
      className="btn login-with-google-btn"
      onClick={() => {
        signInWithPopup(auth, provider);
      }}
    >
      <FcGoogle /> Sign in with Google
    </button>
  );
}
