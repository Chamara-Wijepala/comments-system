import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  query,
  onSnapshot,
  orderBy,
  DocumentReference,
  DocumentData,
  CollectionReference,
} from "firebase/firestore";
import clsx from "clsx";
import { FaEdit } from "react-icons/fa";
import { BsReplyFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";

import UpdateCommentForm from "./UpdateCommentForm";
import ReplyToCommentForm from "./ReplyToCommentForm";
import CommentRating from "./CommentRating";

import { db, auth } from "firebase-config";
import processSnapshot from "utils/processSnapshot";

import { IComment } from "interfaces";

function RenderComment({ comment }: { comment: IComment }) {
  const [replies, setReplies] = useState<IComment[] | null>(null);

  const commentDocRef = doc(db, "comments", comment.docId);
  const repliesColRef = collection(db, "comments", comment.docId, "replies");

  const q = query(repliesColRef, orderBy("createdAt"));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReplies(processSnapshot(snapshot));
    });

    return () => {
      unsubscribe();
    };
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

  async function deleteReplies() {
    const repliesSnapshot = await getDocs(query(repliesColRef));

    repliesSnapshot.forEach((reply) => {
      deleteDoc(doc(db, "comments", comment.docId, "replies", reply.id));
    });
  }

  async function deleteRatings() {
    const ratingsSnapshot = await getDocs(
      query(collection(db, "comments", comment.docId, "ratings"))
    );

    ratingsSnapshot.forEach((rating) => {
      deleteDoc(doc(db, "comments", comment.docId, "ratings", rating.id));
    });
  }

  async function handleDelete(commentDocRef: DocumentReference<DocumentData>) {
    const result = confirm("Are you sure you want to delete this comment?");

    if (result) {
      deleteReplies();
      deleteRatings();
      deleteDoc(commentDocRef);
    }
  }

  return (
    <div id={comment.docId}>
      <div
        className={clsx(
          "comment-container",
          comment.userId === auth.currentUser?.uid && "current",
          comment.userId === "t46mSh1qYHgS6gGvffLKF7jCeTI3"
            ? "admin"
            : "regular"
        )}
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

            <CommentRating comment={comment} />
          </div>

          <div className="comment-body">
            {isBeingEdited && auth.currentUser ? (
              <UpdateCommentForm
                commentToUpdate={comment.body}
                commentDocRef={commentDocRef}
                setIsBeingEdited={setIsBeingEdited}
              />
            ) : (
              <>
                {comment.commentRepliedTo && (
                  <a href={`#${comment.commentRepliedTo}`} className="fw-bold">
                    {comment.userRepliedTo} <BsReplyFill />
                  </a>
                )}

                <p>{comment.body}</p>
              </>
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
                {isBeingRepliedTo ? (
                  "Cancel"
                ) : (
                  <span>
                    <BsReplyFill /> Reply
                  </span>
                )}
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
                  {isBeingEdited ? (
                    "Cancel"
                  ) : (
                    <span>
                      <FaEdit /> Edit
                    </span>
                  )}
                </button>

                <button
                  className="btn btn-small delete-btn"
                  onClick={() => {
                    handleDelete(commentDocRef);
                  }}
                  disabled={isBeingRepliedTo || isBeingEdited ? true : false}
                >
                  <AiFillDelete />
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
          userName={comment.userName}
          repliesColRef={repliesColRef}
          setIsBeingRepliedTo={setIsBeingRepliedTo}
        />
      )}
    </div>
  );
}

export default RenderComment;
