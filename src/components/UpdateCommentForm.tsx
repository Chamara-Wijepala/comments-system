import { useState } from "react";
import {
  updateDoc,
  serverTimestamp,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import TextareaAutosize from "react-textarea-autosize";
import { FaEdit } from "react-icons/fa";

interface Props {
  commentToUpdate: string;
  commentDocRef: DocumentReference<DocumentData>;
  setIsBeingEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

function UpdateCommentForm({
  commentToUpdate,
  commentDocRef,
  setIsBeingEdited,
}: Props) {
  const [textInput, setTextInput] = useState(commentToUpdate);

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (textInput !== commentToUpdate) {
      updateDoc(commentDocRef, {
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
        <FaEdit /> Update
      </button>
    </form>
  );
}

export default UpdateCommentForm;
