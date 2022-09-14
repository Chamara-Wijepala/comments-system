import { CollectionReference } from "firebase/firestore";

export interface IComment {
  userId: string;
  userName: string;
  photo: string;
  docId: string;
  body: string;
  commentRepliedTo?: string;
  userRepliedTo?: string;
  createdAt: string;
  updatedAt?: string;
  replies?: CollectionReference;
}
