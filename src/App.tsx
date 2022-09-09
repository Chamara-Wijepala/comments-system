import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, provider } from "./firebase-config";

import googleLogo from "./assets/google-logo.png";

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <header>
        <div className="container header-container">
          {user ? <LogOut /> : <LogIn />}
        </div>
      </header>
    </>
  );
}

function LogOut() {
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

function LogIn() {
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

export default App;
