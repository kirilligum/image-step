import React, { useState } from 'react';
import './Comments.css';

const Comments = ({ comments, onPostComment, stepId }) => {
  const [newComment, setNewComment] = useState('');

  const handlePost = () => {
    if (newComment.trim()) {
      onPostComment(stepId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="comments-section">
      <h4>Comments</h4>
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              {comment.text}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      <div className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-textarea"
        />
        <button onClick={handlePost} className="post-button">
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;
