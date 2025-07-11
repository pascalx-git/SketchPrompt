import React from 'react';
import { Tldraw } from 'tldraw';
import CustomToolbar from './CustomToolbar';
import CustomComment from './CustomComment';
import './App.css';

export default function App() {
  return (
    <div className="canvas-root">
      <CustomToolbar />
      <div className="canvas-area">
        <Tldraw />
        {/* Example floating comment */}
        <CustomComment
          author="Takumi"
          avatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
          text="I'm not sure about this part... Do we need any community options here?"
        />
      </div>
    </div>
  );
} 