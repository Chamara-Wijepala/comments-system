import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../firebase-config";

function CreateCommentForm() {
  const [textInput, setTextInput] = useState("");
  const user = auth.currentUser;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextInput(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await addDoc(collection(db, "comments"), {
      userId: user?.uid,
      userName: user?.displayName,
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

export default CreateCommentForm;
