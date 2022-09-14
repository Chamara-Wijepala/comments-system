import { useState } from "react";
import {
  addDoc,
  serverTimestamp,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import TextareaAutosize from "react-textarea-autosize";
import { BsReplyFill } from "react-icons/bs";

import { auth } from "firebase-config";

interface Props {
  commentId: string;
  userName: string;
  repliesColRef: CollectionReference<DocumentData>;
  setIsBeingRepliedTo: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReplyToCommentForm({
  commentId,
  userName,
  repliesColRef,
  setIsBeingRepliedTo,
}: Props) {
  const [textInput, setTextInput] = useState("");

  const user = auth.currentUser;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    addDoc(repliesColRef, {
      userId: user?.uid,
      userName: user?.displayName,
      photo: user?.photoURL,
      body: textInput,
      commentRepliedTo: commentId,
      userRepliedTo: userName,
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
          <BsReplyFill /> Reply
        </button>
      </form>
    </div>
  );
}

export default ReplyToCommentForm;
