import { signInWithPopup, signOut } from "firebase/auth";

import { auth, provider } from "../firebase-config";
import googleLogo from "../assets/images/google-logo.png";

export function LogOut() {
  const photo = auth.currentUser?.photoURL;

  return (
    <>
      <img src={photo!} alt="profile picture" />
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
      <img src={googleLogo} alt="google logo" />
      Sign in with Google
    </button>
  );
}
