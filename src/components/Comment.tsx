import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db, auth } from "../firebase-config";

import { IComment } from "../interfaces";

function Comment({ comment }: { comment: IComment }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  return (
    <div className="comment-wrapper">
      <div className="comment">
        <div className="comment-info">
          <img src={comment.photo} alt="" />
          <span className="fw-bold">{comment.userName}</span>
          <span className="opacity-half">
            {comment.updatedAt
              ? `Edited ${comment.updatedAt}`
              : comment.createdAt}
          </span>
        </div>

        <div className="comment-body">
          {isBeingEdited && auth.currentUser ? (
            <UpdateCommentForm
              commentToUpdate={comment.body}
              commentId={comment.docId}
              setIsBeingEdited={setIsBeingEdited}
            />
          ) : (
            <p>{comment.body}</p>
          )}
        </div>

        <div className="button-panel">
          {comment.userId === auth.currentUser?.uid && (
            <button
              onClick={() => {
                setIsBeingEdited(!isBeingEdited);
              }}
            >
              {isBeingEdited ? "Cancel" : "Edit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface UpdateCommentFormProps {
  commentToUpdate: string;
  commentId: string;
  setIsBeingEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

function UpdateCommentForm({
  commentToUpdate,
  commentId,
  setIsBeingEdited,
}: UpdateCommentFormProps) {
  const [textInput, setTextInput] = useState(commentToUpdate);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextInput(e.target.value);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await updateDoc(doc(db, "comments", commentId), {
      body: textInput,
      updatedAt: serverTimestamp(),
    });

    setIsBeingEdited(false);
  }

  return (
    <form onSubmit={handleUpdate}>
      <textarea
        cols={30}
        rows={10}
        required
        spellCheck
        maxLength={300}
        value={textInput}
        onChange={handleChange}
      ></textarea>

      <button type="submit">Update</button>
    </form>
  );
}

export default Comment;
