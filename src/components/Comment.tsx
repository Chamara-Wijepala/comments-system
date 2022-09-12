import { useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import TextareaAutosize from "react-textarea-autosize";

import { db, auth } from "../firebase-config";

import { IComment } from "../interfaces";

function Comment({ comment }: { comment: IComment }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingRepliedTo, setIsBeingRepliedTo] = useState(false);

  function handleDelete(commentId: string) {
    const result = confirm("Are you sure you want to delete this comment?");

    if (result) {
      deleteDoc(doc(db, "comments", commentId));
    }
  }

  return (
    <div>
      <div className="comment-top-border">
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
            {auth.currentUser && (
              <button
                className="btn btn-small"
                onClick={() => {
                  setIsBeingRepliedTo(!isBeingRepliedTo);
                }}
                disabled={isBeingEdited ? true : false}
              >
                {isBeingRepliedTo ? "Cancel" : "Reply"}
              </button>
            )}

            {comment.userId === auth.currentUser?.uid && (
              <>
                <button
                  className="btn btn-small"
                  onClick={() => {
                    setIsBeingEdited(!isBeingEdited);
                  }}
                  disabled={isBeingRepliedTo ? true : false}
                >
                  {isBeingEdited ? "Cancel" : "Edit"}
                </button>

                <button
                  className="btn btn-small delete-btn"
                  onClick={() => {
                    handleDelete(comment.docId);
                  }}
                  disabled={isBeingRepliedTo || isBeingEdited ? true : false}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {isBeingRepliedTo && (
        <ReplyToCommentForm
          commentId={comment.docId}
          setIsBeingRepliedTo={setIsBeingRepliedTo}
        />
      )}
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

    if (textInput !== commentToUpdate) {
      updateDoc(doc(db, "comments", commentId), {
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
        onChange={handleChange}
      />

      <button type="submit" className="btn btn-small">
        Update
      </button>
    </form>
  );
}

interface ReplyToCommentFormProps {
  commentId: string;
  setIsBeingRepliedTo: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReplyToCommentForm({
  commentId,
  setIsBeingRepliedTo,
}: ReplyToCommentFormProps) {
  const [textInput, setTextInput] = useState("");

  const user = auth.currentUser;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    addDoc(collection(db, "comments", commentId, "replies"), {
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

export default Comment;
