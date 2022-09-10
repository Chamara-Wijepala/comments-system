import { IComment } from "../interfaces";

interface Props {
  comment: IComment;
}

function Comment({ comment }: Props) {
  return (
    <div className="comment-wrapper" key={comment.docId}>
      <div className="comment">
        <div className="comment-info">
          <img src={comment.photo} alt="" />
          <span className="commenter-name">{comment.userName}</span>
          <span className="created-date">{comment.createdAt}</span>
        </div>

        <p className="comment-body">{comment.body}</p>

        <div className="button-panel">
          <button>Edit</button>
          {}
        </div>
      </div>
    </div>
  );
}

export default Comment;
