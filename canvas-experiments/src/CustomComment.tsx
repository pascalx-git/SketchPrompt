import React from 'react';
import './CustomComment.css';

export default function CustomComment({ author, avatarUrl, text }) {
  return (
    <div className="custom-comment">
      <div className="comment-header">
        <img className="comment-avatar" src={avatarUrl} alt={author} />
        <span className="comment-author">{author}</span>
      </div>
      <div className="comment-body">{text}</div>
      <input className="comment-input" placeholder="Add your comment..." />
    </div>
  );
} 