import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import TextareaAutosize from "react-textarea-autosize";
import { MdComment } from "react-icons/md";

import { auth, db } from "../firebase-config";

function CreateCommentForm() {
  const [textInput, setTextInput] = useState("");
  const user = auth.currentUser;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextInput(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    addDoc(collection(db, "comments"), {
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
      <div className="create-comment-form-wrapper">
        <TextareaAutosize
          minRows={5}
          spellCheck
          required
          placeholder="Leave a comment..."
          maxLength={1000}
          value={textInput}
          onChange={handleChange}
          disabled={user ? false : true}
        />

        <button
          type="submit"
          className="btn btn-small"
          disabled={user ? false : true}
        >
          <MdComment /> Post
        </button>
      </div>
    </form>
  );
}

export default CreateCommentForm;
