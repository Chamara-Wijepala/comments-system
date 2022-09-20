import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  onSnapshot,
  doc,
  where,
  getDocs,
} from "firebase/firestore";
import { IoHeartCircle, IoHeartCircleOutline } from "react-icons/io5";

import { db, auth } from "firebase-config";

import { IComment } from "interfaces";

interface Ratings {
  docId: string;
  userId: string;
}

function CommentRating({ comment }: { comment: IComment }) {
  const [ratings, setRatings] = useState<Ratings[] | null>(null);

  const ratingsColRef = collection(db, "comments", comment.docId, "ratings");

  const hasCurrentUserRated = ratings?.find(
    (rating) => rating.userId === auth.currentUser?.uid
  );

  async function addRating() {
    await addDoc(ratingsColRef, { userId: auth.currentUser?.uid });
  }

  async function removeRating() {
    const ratingToDelete = await getDocs(
      query(ratingsColRef, where("userId", "==", auth.currentUser?.uid))
    );

    const docId = doc(
      db,
      "comments",
      comment.docId,
      "ratings",
      ratingToDelete.docs[0].id
    );

    await deleteDoc(docId);
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(query(ratingsColRef), (snapshot) => {
      setRatings(
        snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        })) as Ratings[]
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <button
      className="btn btn-small ratings-btn"
      onClick={hasCurrentUserRated ? removeRating : addRating}
    >
      {ratings && ratings.length}
      {hasCurrentUserRated !== undefined ? (
        <IoHeartCircle />
      ) : (
        <IoHeartCircleOutline />
      )}
    </button>
  );
}

export default CommentRating;
