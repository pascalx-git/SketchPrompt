import React from 'react';
import './CustomToolbar.css';

export default function CustomToolbar() {
  return (
    <div className="custom-toolbar">
      <button className="toolbar-btn">✏️</button>
      <button className="toolbar-btn">⬛</button>
      <button className="toolbar-btn">🖊️</button>
      <div className="toolbar-divider" />
      <button className="toolbar-btn">Share</button>
      <button className="toolbar-avatar">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
      </button>
    </div>
  );
} 