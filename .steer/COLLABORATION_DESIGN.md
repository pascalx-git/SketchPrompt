# SketchPrompt Collaboration Design

## Overview

This document outlines the technical architecture for implementing multi-user and AI-assisted collaboration features in SketchPrompt.

## Current Foundation

The robust auto-save and file-watching system we've implemented provides the foundation for collaboration:

- **Content-aware saves**: Only persist meaningful document changes
- **Debounced operations**: Prevent excessive I/O and network traffic
- **File-watching with self-trigger suppression**: Avoid reload loops
- **Deep equality checks**: Efficient change detection

## Phase 1: AI-Assisted Sketching (Single User + AI)

### Architecture
```
User Sketching → TLDraw Editor → Content Change Detection → AI Integration Layer → File System
```

### Implementation Steps

1. **AI Integration Layer**
   - Create an `AIService` class that can:
     - Parse TLDraw snapshots
     - Generate AI suggestions based on sketch content
     - Apply AI edits to sketches
     - Handle AI-initiated file changes

2. **AI-Triggered File Changes**
   - Extend the current file-watching system to handle AI edits
   - AI edits should trigger the same debounced reload logic
   - Add visual indicators when AI is making changes

3. **AI Prompt Generation**
   - Analyze sketch content to generate contextual prompts
   - Support for different AI models (Claude, GPT, etc.)
   - Allow users to request specific types of AI assistance

### Technical Implementation

```typescript
interface AIService {
  analyzeSketch(snapshot: TLDrawSnapshot): Promise<AIAnalysis>;
  suggestImprovements(snapshot: TLDrawSnapshot): Promise<AISuggestion[]>;
  applyAIEdit(snapshot: TLDrawSnapshot, edit: AIEdit): Promise<TLDrawSnapshot>;
  generatePrompt(snapshot: TLDrawSnapshot, context: string): Promise<string>;
}

interface AIAnalysis {
  elements: number;
  complexity: 'low' | 'medium' | 'high';
  suggestions: string[];
  tags: string[];
}
```

## Phase 2: Real-Time Multi-User Collaboration

### Architecture
```
User A → WebSocket → Collaboration Server → WebSocket → User B
   ↓                    ↓                    ↓
TLDraw Editor    →  Conflict Resolution  →  TLDraw Editor
```

### Core Components

1. **Collaboration Server**
   - WebSocket-based real-time communication
   - Room-based session management
   - Operational Transformation (OT) for conflict resolution

2. **Client-Side Collaboration**
   - Extend TLDraw with collaboration capabilities
   - User presence indicators
   - Cursor position sharing
   - Real-time sync of sketch changes

3. **Conflict Resolution**
   - Use TLDraw's built-in collaboration features
   - Implement custom OT if needed for specific features
   - Handle offline scenarios with sync on reconnection

### Technical Implementation

```typescript
interface CollaborationService {
  joinRoom(roomId: string, userId: string): Promise<void>;
  leaveRoom(): void;
  sendChange(change: SketchChange): void;
  onUserJoined(callback: (user: User) => void): void;
  onUserLeft(callback: (userId: string) => void): void;
  onChangeReceived(callback: (change: SketchChange) => void): void;
}

interface User {
  id: string;
  name: string;
  color: string;
  cursor?: CursorPosition;
}
```

## Phase 3: Cloud Sync & Sharing

### Architecture
```
Local File → Cloud Storage → Share Link → Remote Access
```

### Implementation

1. **Cloud Storage Integration**
   - Support for multiple providers (Firebase, Supabase, AWS S3)
   - Automatic sync when online
   - Offline-first with conflict resolution

2. **Sharing System**
   - Generate shareable links
   - Permission-based access control
   - Public/private sketch management

3. **Version Control**
   - Track sketch versions
   - Allow rollback to previous versions
   - Show edit history

## Phase 4: Advanced Features

### User Presence & Permissions
- Real-time user presence indicators
- Role-based permissions (view, edit, comment, admin)
- Cursor position sharing
- Activity indicators

### Comments & Annotations
- Inline comments on sketch elements
- Sticky notes and annotations
- Thread-based discussions
- @mentions and notifications

### AI Enhancement
- AI-powered sketch analysis
- Automated suggestions and improvements
- Style transfer and enhancement
- Content-aware AI assistance

## Technical Considerations

### Performance
- Efficient diffing for large sketches
- Lazy loading of sketch history
- Optimized network payloads
- Client-side caching

### Scalability
- Horizontal scaling of collaboration servers
- Database optimization for sketch storage
- CDN integration for global performance
- Load balancing for real-time connections

### Security
- End-to-end encryption for sensitive sketches
- Secure sharing mechanisms
- User authentication and authorization
- Data privacy compliance

### Offline Support
- Local-first architecture
- Conflict resolution on reconnection
- Progressive web app capabilities
- Data synchronization strategies

## Implementation Timeline

### Week 1-2: AI Integration Foundation
- Set up AI service architecture
- Implement basic AI analysis
- Add AI-triggered file change handling

### Week 3-4: Real-Time Collaboration Core
- Set up WebSocket infrastructure
- Implement basic user presence
- Add real-time sketch synchronization

### Week 5-6: Cloud Sync & Sharing
- Integrate cloud storage
- Implement sharing system
- Add version control

### Week 7-8: Advanced Features
- Add comments and annotations
- Implement permissions system
- Enhance AI capabilities

## Dependencies

- **TLDraw Collaboration**: Leverage TLDraw's built-in collaboration features
- **WebSocket Library**: Socket.io or native WebSocket
- **Cloud Platform**: Firebase, Supabase, or custom solution
- **AI Integration**: OpenAI, Anthropic, or other AI service APIs
- **Database**: PostgreSQL, MongoDB, or cloud database

## Success Metrics

- **Performance**: <100ms latency for real-time updates
- **Reliability**: 99.9% uptime for collaboration features
- **Scalability**: Support 100+ concurrent users per room
- **User Experience**: Seamless collaboration without conflicts
- **AI Integration**: Meaningful AI suggestions and assistance 