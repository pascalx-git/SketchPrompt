# Backlog

| Task                                      | Priority   | Status      | Description                                                                 |
|-------------------------------------------|------------|-------------|-----------------------------------------------------------------------------|
| TLDraw React integration                  | High       | Completed   | Integrate TLDraw as the core sketching engine in the extension.              |
| Custom editor for .sketchprompt files     | High       | Completed   | Implement a dedicated editor for .sketchprompt files in Cursor IDE.          |
| Robust auto-save & file-watching          | High       | Completed   | Implemented debounced, content-aware auto-save with file-watching that only saves when document changes and ignores self-triggered reloads. Scales for AI/collaboration. |
| Copy to Prompt (export as image)          | Medium     | Completed   | Allow users to export sketches as images and insert into documents/chat.     |
| New Sketch command                        | Medium     | Completed   | Command to create a new .sketchprompt file from the command palette or file explorer context menu.         |
| Context menu integration                  | Medium     | Completed   | Add 'New Sketch' to the explorer/folder context menu.                        |
| Webview security (CSP) fixes              | High       | Completed   | Update Content Security Policy for TLDraw CDN and webview compatibility.     |
| Vite/React/TypeScript build system        | High       | Completed   | Modernize build system for webview and extension.                            |
| Export PNG/SVG (TLDraw built-in)          | Medium     | Completed   | TLDraw provides built-in export functionality for PNG/SVG.                   |
| Copy to clipboard (TLDraw built-in)       | Medium     | Completed   | TLDraw provides built-in copy to clipboard functionality.                    |
| TLDraw snapshot format documentation      | Medium     | Completed   | Documented the TLDraw snapshot format for AI and external tool integration. |
| Remove custom sidebar/panel/search UI     | High       | Completed   | All custom sidebar, panel, and search UI removed. Management is now via file explorer and command palette only. |
| Help command opens Help.md                | Medium     | Completed   | 'Help' command now opens a Help.md file with usage and documentation.        |
| **AI-assisted sketching & collaboration** | **High**   | **Next**    | **Core feature: AI can edit sketches in real-time, suggest improvements, and collaborate with users.** |
| **Real-time multi-user collaboration**    | **High**   | **Next**    | **Multiple users can sketch together in real-time with conflict resolution.** |
| **Cloud sync & sharing**                  | **High**   | **Next**    | **Sync sketches to cloud storage and share via links for collaboration.** |
| **Conflict resolution system**            | **High**   | **Next**    | **Handle concurrent edits from multiple users/AI with intelligent merging.** |
| **AI prompt generation from sketches**    | **Medium** | **Next**    | **Generate contextual prompts from sketch content for AI assistance.** |
| **Version control & history**             | **Medium** | **Next**    | **Track sketch versions, allow rollback, and show edit history.** |
| **Live annotation/comment layer**         | **Medium** | **Next**    | **Enable live comments/annotations on sketches for collaboration.** |
| **User presence indicators**              | **Medium** | **Next**    | **Show who is currently editing the sketch and their cursor position.** |
| **Collaboration permissions**             | **Medium** | **Next**    | **Control who can view, edit, or comment on sketches.** |
| Light/Dark theme adaptation               | Medium     | Needs Work  | Ensure robust theme adaptation in all UI elements.                           |
| Error handling & user feedback            | High       | Needs Work  | Add robust error handling and user feedback for all critical actions.        |
| Untitled/new file handling                | Medium     | Needs Work  | Prompt user to save untitled files or auto-save to temp location.            |
| GitHub sync/export to README              | Low        | Backlog     | Sync sketches to GitHub or export to project README.                         |
| Inline sticky notes/annotations           | Low        | Backlog     | Add sticky notes/annotations to sketches.                                    |
| Premium: Multi-canvas, AI captioning      | Low        | Backlog     | Premium features: multi-canvas, AI captioning, export-to-git, collaboration. |
| Custom Panel for Extension Actions/File Management | Low | Backlog | Build a custom panel for managing extension actions and files. Not a blocker; for future enhancement. **Note: Test sidepanel implementation after fixing SketchPromptCustomEditor registration issues.** |

## Multi-User/AI Collaboration Architecture

### Core Components Needed:
1. **WebSocket/WebRTC connection** for real-time communication
2. **Operational Transformation (OT)** or **Conflict-free Replicated Data Types (CRDT)** for conflict resolution
3. **User presence system** showing who's editing
4. **Permission system** for access control
5. **Version control** for tracking changes
6. **AI integration layer** for automated suggestions and edits

### Implementation Priority:
1. **Phase 1**: AI-assisted sketching (single user + AI)
2. **Phase 2**: Real-time collaboration (multiple users)
3. **Phase 3**: Cloud sync and sharing
4. **Phase 4**: Advanced features (permissions, versioning, etc.)

### Technical Considerations:
- Use TLDraw's built-in collaboration features where possible
- Implement efficient diffing for large sketches
- Consider using existing collaboration platforms (Firebase, Supabase, etc.)
- Ensure offline-first capabilities with sync when online 