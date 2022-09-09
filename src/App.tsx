import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, provider, db } from "./firebase-config";

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

      <main className="container">
        <article>
          <h2>Article Header</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            autem porro adipisci atque ut quis explicabo eum facilis minus hic,
            quos debitis aliquam amet sit perspiciatis! Nulla id culpa eos ut
            perferendis commodi est voluptatem quasi fugiat, necessitatibus
            ipsa, consequatur minima reprehenderit suscipit ex placeat ipsum.
            Beatae obcaecati illo, ab autem cupiditate nihil hic, earum sequi
            qui impedit vel vitae ut neque voluptatum recusandae? Earum optio
            eius libero voluptatum ratione aperiam eum, blanditiis iusto error
            laudantium voluptates itaque sint at quos veritatis eos quam
            voluptatem amet nobis asperiores numquam ullam rem recusandae! At,
            repellendus. Quasi, consequatur. Esse dolorem animi perferendis?
          </p>
        </article>

        <Form />
      </main>
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

function Form() {
  const [textInput, setTextInput] = useState("");
  const user = auth.currentUser;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextInput(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await addDoc(collection(db, "comments"), {
      commenter: user?.displayName,
      photo: user?.photoURL,
      body: textInput,
      createdAt: serverTimestamp(),
    });

    setTextInput("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        cols={30}
        rows={10}
        required
        spellCheck
        placeholder="Leave a comment..."
        maxLength={300}
        value={textInput}
        onChange={handleChange}
        disabled={user ? false : true}
      ></textarea>

      <button type="submit">Comment</button>
    </form>
  );
}

export default App;
