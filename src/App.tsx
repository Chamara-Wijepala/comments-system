import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "./firebase-config";
import { LogIn, LogOut } from "./components/Authentication";
import { CommentForm } from "./components/CommentForm";
import Comment from "./components/Comment";

import { IComment } from "./interfaces";

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <header>
        <div className="container container-lg header-container">
          {user ? <LogOut /> : <LogIn />}
        </div>
      </header>

      <main className="container container-md">
        <article>
          <h2>Article Header</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            autem porro adipisci atque ut quis explicabo eum facilis minus hic,
            quos debitis aliquam amet sit perspiciatis! Nulla id culpa eos ut
            perferendis commodi est voluptatem quasi fugiat, necessitatibus
            ipsa, consequatur minima reprehenderit suscipit ex placeat ipsum.
            Beatae obcaecati illo, ab autem cupiditate nihil hic, earum sequi
            qui impedit vel vitae ut neque voluptatum recusandae? Earum optio
            eius libero voluptatum ratione aperiam eum, blanditiis iusto error
            laudantium voluptates itaque sint at quos veritatis eos quam
            voluptatem amet nobis asperiores numquam ullam rem recusandae! At,
            repellendus. Quasi, consequatur. Esse dolorem animi perferendis?
          </p>
        </article>

        <CommentForm />

        <CommentSection />
      </main>
    </>
  );
}

function CommentSection() {
  const [comments, setComments] = useState<IComment[]>([]);

  const q = query(collection(db, "comments"), orderBy("createdAt"));

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({
          userId: doc.data().userId,
          userName: doc.data().userName,
          photo: doc.data().photo,
          docId: doc.id,
          body: doc.data().body,
          createdAt: doc.data().createdAt?.toDate().toDateString(),
        }))
      );
    });
  }, []);

  return (
    <section className="comment-section">
      {comments?.map((comment) => (
        <Comment comment={comment} />
      ))}
    </section>
  );
}

export default App;
