import { useState } from "react";
import {
  addDoc,
  serverTimestamp,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import TextareaAutosize from "react-textarea-autosize";

import { auth } from "firebase-config";

interface Props {
  colRef: CollectionReference<DocumentData>;
  setIsBeingRepliedTo: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReplyToCommentForm({ colRef, setIsBeingRepliedTo }: Props) {
  const [textInput, setTextInput] = useState("");

  const user = auth.currentUser;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    addDoc(colRef, {
      userId: user?.uid,
      userName: user?.displayName,
      photo: user?.photoURL,
      body: textInput,
      createdAt: serverTimestamp(),
    });

    setIsBeingRepliedTo(false);
  }

  return (
    <div className="nested-component">
      <form onSubmit={handleSubmit}>
        <TextareaAutosize
          minRows={5}
          spellCheck
          required
          maxLength={1000}
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
          }}
        />

        <button type="submit" className="btn btn-small">
          Reply
        </button>
      </form>
    </div>
  );
}

export default ReplyToCommentForm;
