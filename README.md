# ![SketchPrompt Logo](media/logo.svg) SketchPrompt

[See Help & Usage Guide →](Help.md)

A powerful Cursor IDE extension for visual thinking and AI prompting—best used for quickly sketching ideas and intent to make human-AI collaboration more seamless. Sketch > Copy > Paste into Cursor Chat. Done. Expect more crazy powerful features in the future.

## ✨ Features

- **🎨 Rich Sketching**: Full TLDraw integration with shapes, text, drawing tools, and more
- **💾 Robust Auto-Save**: Content-aware saving with debounced operations and file-watching
- **🤖 AI-Ready**: Structured JSON format for AI analysis and collaboration
- **📁 File Persistence**: Save and load sketches as `.sketchprompt` files with version control
- **📋 Copy to Prompt**: Export sketches as images and seamlessly insert into your prompts
- **🎯 Custom Editor**: Dedicated editor for `.sketchprompt` files with syntax highlighting
- **🔄 Real-time Sync**: File-watching with external change detection and auto-reload
- **👥 Collaboration Ready**: Foundation for multi-user and AI-assisted sketching

## 🚀 Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run vscode:prepublish`
4. Package the extension: `npx vsce package`
5. Install the `.vsix` file in Cursor IDE

## 📖 Usage

### Creating a New Sketch

- Open the command palette (`Cmd/Ctrl + Shift + P`)
- Run **"SketchPrompt: New Sketch"**
- Or right-click in the file explorer and select **"SketchPrompt: New Sketch"**
- A new `.sketchprompt` file will be created in the `SketchPrompt` folder
- The file will open in the SketchPrompt editor

### Editing Sketches

- Open any `.sketchprompt` file to edit it visually
- All changes are auto-saved

### Getting Help

- Run **"SketchPrompt: Help"** from the command palette to open the local `Help.md` file in your workspace.
- The `Help.md` file contains usage tips and a link to the [GitHub repo](https://github.com/pascalx-git/SketchPrompt) for the latest updates.

## Working with .sketchprompt Files

- `.sketchprompt` files are automatically opened in the SketchPrompt editor
- **Smart Auto-Save**: Only saves when content actually changes (not on mouse movement)
- **File Watching**: Automatically reloads when files are modified externally
- **JSON Format**: Files contain structured data that can be version controlled and analyzed by AI

## 🔧 Development

### Building

```bash
# Build the webview (React app)
npm run build-webview

# Build the extension
npm run compile

# Build both
npm run vscode:prepublish
```

### Watching for Changes

```bash
# Watch webview changes
npm run watch-webview

# Watch extension changes
npm run watch
```

### Testing

1. Press `F5` in Cursor to launch the extension in debug mode
2. Create a new sketch and test the functionality
3. Check the developer console for any errors

## 🏗️ Architecture

- **Extension**: TypeScript-based VS Code extension
- **Webview**: React app with TLDraw integration
- **Build**: Vite for webview bundling, TypeScript for extension compilation
- **Auto-Save**: Debounced, content-aware saving with deep equality checks
- **File Watching**: Self-trigger suppression to prevent reload loops

## 🔮 Roadmap

### Phase 1: AI-Assisted Sketching (Next)
- AI integration layer for automated suggestions
- AI-triggered file changes with visual indicators
- Contextual prompt generation from sketch content

### Phase 2: Real-Time Collaboration
- Multi-user sketching with conflict resolution
- User presence indicators and cursor sharing
- WebSocket-based real-time communication

### Phase 3: Cloud Sync & Sharing
- Cloud storage integration (Firebase, Supabase)
- Shareable links and permission-based access
- Version control and edit history

## 📦 Dependencies

- `tldraw`: Rich sketching library
- `react` & `react-dom`: UI framework
- `vite`: Build tool for the webview
- `typescript`: Extension development

## 📄 License

MIT

## Licensing & Attribution

SketchPrompt is licensed under the MIT License. This project bundles the TLDraw SDK, which is licensed separately by tldraw, Inc. and is subject to its own terms. By using SketchPrompt, you agree to comply with both the MIT License and the TLDraw SDK License.

- [See LICENSE file for full details](LICENSE)
- [TLDraw SDK License](https://tldraw.dev/legal/tldraw-license)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in Cursor
5. Submit a pull request

---

**Version**: 0.0.2 | **Last Updated**: July 2024 | **Compatibility**: Cursor IDE
