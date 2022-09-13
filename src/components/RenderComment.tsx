import { useState, useEffect } from "react";
import {
  collection,
  doc,
  deleteDoc,
  query,
  onSnapshot,
  orderBy,
  DocumentReference,
  DocumentData,
  CollectionReference,
} from "firebase/firestore";

import UpdateCommentForm from "./UpdateCommentForm";
import ReplyToCommentForm from "./ReplyToCommentForm";

import { db, auth } from "firebase-config";

import { IComment } from "interfaces";

function RenderComment({ comment }: { comment: IComment }) {
  const [replies, setReplies] = useState<IComment[] | null>(null);

  const commentDocRef = doc(db, "comments", comment.docId);
  const repliesColRef = collection(db, "comments", comment.docId, "replies");

  const q = query(repliesColRef, orderBy("createdAt"));

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setReplies(
        snapshot.docs.map((doc) => ({
          userId: doc.data().userId,
          userName: doc.data().userName,
          photo: doc.data().photo,
          docId: doc.id,
          body: doc.data().body,
          createdAt: doc.data().createdAt?.toDate().toDateString(),
          updatedAt: doc.data().updatedAt?.toDate().toDateString(),
        }))
      );
    });
  }, []);

  return (
    <div className="parent-comment">
      <Comment
        comment={comment}
        commentDocRef={commentDocRef}
        repliesColRef={repliesColRef}
      />
      <>
        {replies &&
          replies.map((reply) => (
            <div key={reply.docId} className="nested-component">
              <Comment
                comment={reply}
                commentDocRef={doc(
                  db,
                  "comments",
                  comment.docId,
                  "replies",
                  reply.docId
                )}
                repliesColRef={repliesColRef}
              />
            </div>
          ))}
      </>
    </div>
  );
}

interface CommentProps {
  comment: IComment;
  commentDocRef: DocumentReference<DocumentData>;
  repliesColRef: CollectionReference<DocumentData>;
}

function Comment({ comment, commentDocRef, repliesColRef }: CommentProps) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingRepliedTo, setIsBeingRepliedTo] = useState(false);

  function handleDelete(commentDocRef: DocumentReference<DocumentData>) {
    const result = confirm("Are you sure you want to delete this comment?");

    if (result) {
      deleteDoc(commentDocRef);
    }
  }

  return (
    <div>
      <div
        className={
          "comment-container " +
          (comment.userId === "t46mSh1qYHgS6gGvffLKF7jCeTI3"
            ? "admin"
            : "regular")
        }
      >
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
                commentDocRef={commentDocRef}
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
                    handleDelete(commentDocRef);
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
          repliesColRef={repliesColRef}
          setIsBeingRepliedTo={setIsBeingRepliedTo}
        />
      )}
    </div>
  );
}

export default RenderComment;
