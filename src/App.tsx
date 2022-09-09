import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, provider } from "./firebase-config";

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <header>
        {user ? (
          <div>
            <img src={user.photoURL!} alt="profile picture" />
            <button
              onClick={() => {
                signOut(auth);
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              signInWithPopup(auth, provider);
            }}
          >
            Sign in with Google
          </button>
        )}
      </header>
    </>
  );
}

export default App;
