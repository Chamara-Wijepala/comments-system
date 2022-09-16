import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth, db } from "firebase-config";
import { LogIn, LogOut } from "components/Authentication";
import CreateCommentForm from "components/CreateCommentForm";
import RenderComment from "components/RenderComment";

import processSnapshot from "utils/processSnapshot";

import { IComment } from "interfaces";

function App() {
  const [user, setUser] = useState<User | null>(null);

  // wrapping the onAuthStateChanged in a useEffect will prevent user state
  // from being set twice
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userObj) => {
      setUser(userObj ? userObj : null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

        <CreateCommentForm />

        <CommentSection />
      </main>
    </>
  );
}

function CommentSection() {
  const [comments, setComments] = useState<IComment[]>([]);

  const q = query(collection(db, "comments"), orderBy("createdAt"));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(processSnapshot(snapshot));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section className="comment-section">
      {comments?.map((comment) => (
        <RenderComment key={comment.docId} comment={comment} />
      ))}
    </section>
  );
}

export default App;
