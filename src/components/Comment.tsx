import { useState } from "react";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import TextareaAutosize from "react-textarea-autosize";

import { db, auth } from "../firebase-config";

import { IComment } from "../interfaces";

function Comment({ comment }: { comment: IComment }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  function handleDelete(commentId: string) {
    const result = confirm("Are you sure you want to delete this comment?");

    if (result) {
      deleteDoc(doc(db, "comments", commentId));
    }
  }

  return (
    <div className="comment-wrapper">
      <div className="comment">
        <div className="comment-info">
          <img src={comment.photo} alt="" className="profile-picture" />
          <span className="fw-bold">{comment.userName}</span>
          <span className="date opacity-half">
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
            <>
              <button
                className="btn btn-small"
                onClick={() => {
                  setIsBeingEdited(!isBeingEdited);
                }}
              >
                {isBeingEdited ? "Cancel" : "Edit"}
              </button>

              <button
                className="btn btn-small delete-btn"
                onClick={() => {
                  handleDelete(comment.docId);
                }}
              >
                Delete
              </button>
            </>
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

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updateDoc(doc(db, "comments", commentId), {
      body: textInput,
      updatedAt: serverTimestamp(),
    });

    setIsBeingEdited(false);
  }

  return (
    <form onSubmit={handleUpdate}>
      <TextareaAutosize
        minRows={5}
        spellCheck
        required
        maxLength={1000}
        value={textInput}
        onChange={handleChange}
      />

      <button type="submit" className="btn btn-small">
        Update
      </button>
    </form>
  );
}

export default Comment;
