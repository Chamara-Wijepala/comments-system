import { QuerySnapshot, DocumentData } from "firebase/firestore";

import { IComment } from "interfaces";

function processSnapshot(snapshot: QuerySnapshot<DocumentData>) {
  const processedSnapshot: IComment[] = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();

    processedSnapshot.push({
      docId: doc.id,
      userId: data.userId,
      userName: data.userName,
      photo: data.photo,
      body: data.body,
      createdAt: data.createdAt?.toDate().toDateString(),
      updatedAt: data.updatedAt?.toDate().toDateString(),
      replies: data.replies,
      ratings: data.ratings,
      commentRepliedTo: data.commentRepliedTo,
      userRepliedTo: data.userRepliedTo,
    });
  });

  return processedSnapshot;
}

export default processSnapshot;
