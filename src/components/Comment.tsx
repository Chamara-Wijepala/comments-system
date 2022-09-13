import { useState } from "react";
import { collection, doc, deleteDoc } from "firebase/firestore";

import UpdateCommentForm from "./UpdateCommentForm";
import ReplyToCommentForm from "./ReplyToCommentForm";

import { db, auth } from "firebase-config";

import { IComment } from "interfaces";

function Comment({ comment }: { comment: IComment }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingRepliedTo, setIsBeingRepliedTo] = useState(false);

  const docRef = doc(db, "comments", comment.docId);
  const colRef = collection(db, "comments", comment.docId, "replies");

  function handleDelete(commentId: string) {
    const result = confirm("Are you sure you want to delete this comment?");

    if (result) {
      deleteDoc(doc(db, "comments", commentId));
    }
  }

  return (
    <div className="comment-container">
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
                docRef={docRef}
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
          colRef={colRef}
          setIsBeingRepliedTo={setIsBeingRepliedTo}
        />
      )}
    </div>
  );
}

export default Comment;
