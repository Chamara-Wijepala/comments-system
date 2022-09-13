import { useState } from "react";
import {
  updateDoc,
  serverTimestamp,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import TextareaAutosize from "react-textarea-autosize";

interface Props {
  commentToUpdate: string;
  docRef: DocumentReference<DocumentData>;
  setIsBeingEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

function UpdateCommentForm({
  commentToUpdate,
  docRef,
  setIsBeingEdited,
}: Props) {
  const [textInput, setTextInput] = useState(commentToUpdate);

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (textInput !== commentToUpdate) {
      updateDoc(docRef, {
        body: textInput,
        updatedAt: serverTimestamp(),
      });
    }

    setIsBeingEdited(false);
  }

  return (
    <form onSubmit={handleUpdate}>
      <TextareaAutosize
        spellCheck
        required
        maxLength={1000}
        value={textInput}
        onChange={(e) => {
          setTextInput(e.target.value);
        }}
      />

      <button type="submit" className="btn btn-small">
        Update
      </button>
    </form>
  );
}

export default UpdateCommentForm;
