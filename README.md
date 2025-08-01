# ![SketchPrompt Logo](media/logo-icon.png) SketchPrompt

[![Version](https://img.shields.io/badge/version-0.2.3-blue.svg?labelColor=%23cccccc&color=%233b82f6)](https://github.com/pascalx-git/SketchPrompt)
[![License](https://img.shields.io/badge/license-MIT-green.svg?labelColor=%23cccccc&color=%233b82f6)](LICENSE)
[![Open VSX Downloads](https://img.shields.io/open-vsx/dt/PascalX/SketchPrompt?labelColor=%23cccccc&color=%233b82f6)](https://open-vsx.org/extension/PascalX/SketchPrompt)
[![Open VSX Rating](https://img.shields.io/open-vsx/stars/PascalX/SketchPrompt?labelColor=%23cccccc&color=%233b82f6)](https://open-vsx.org/extension/PascalX/SketchPrompt)
[![Open VSX Release Date](https://img.shields.io/open-vsx/release-date/PascalX/SketchPrompt?labelColor=%23cccccc&color=%233b82f6)](https://open-vsx.org/extension/PascalX/SketchPrompt)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/PascalX-Git/SketchPrompt?labelColor=%23cccccc&color=%233b82f6)](https://github.com/pascalx-git/SketchPrompt)

[See Help & Usage Guide →](HELP.md)

A powerful VS Code extension for visual thinking and AI prompting—best used for quickly sketching ideas and intent to make human-AI collaboration more seamless. Works in any OpenVSX-compatible editor (Cursor IDE, Windsurf, Google Firebase Studio, etc). Sketch > Copy > Paste into any AI chat. Done. 

**Website**: [https://sketch-prompt.com](https://sketch-prompt.com)

## Features

- **Multi-Editor Support**: Works in any OpenVSX-compatible editor (Cursor IDE, Windsurf, Google Firebase Studio, etc.)
- **Rich Sketching**: Full sketching canvas with shapes, text, drawing tools, and more
- **Copy to Prompt**: Copy sketches as images and seamlessly insert into any AI chat
- **Privacy-First**: Local processing with no data collection or cloud dependencies
- **Auto-Save**: Your work is automatically saved as you sketch
- **Custom Editor**: Dedicated editor for `.sketchprompt` files with smart file watching
- **AI-Ready**: Structured format for future AI analysis and collaboration
- **Security-Focused**: Open source, auditable code with regular security reviews

## Compatibility

SketchPrompt is distributed via the [OpenVSX registry](https://open-vsx.org/) and works in any OpenVSX-compatible editor:

### **Supported Editors**
- **Cursor IDE** - Full support with all features
- **Windsurf** - Full support with all features  
- **Google Firebase Studio** - Full support with all features
- **VS Code** - Full support with all features
- **Any OpenVSX-compatible editor** - Full support

### **Installation Method**
All editors use the same installation process:
1. Open your editor's extension marketplace
2. Search for "SketchPrompt"
3. Click Install

### **Feature Parity**
All features work identically across all supported editors:
- Sketching canvas and tools
- File persistence and auto-save
- Copy to prompt functionality
- Custom `.sketchprompt` file editor
- Command palette integration

## Installation

### Option 1: For OpenVSX-Compatible Editors
**Install SketchPrompt from your editor's extension marketplace:**
1. Open your OpenVSX-compatible editor (Cursor IDE, Windsurf, Google Firebase Studio, etc.)
2. Go to Extensions (Cmd/Ctrl + Shift + X)
3. Search for "SketchPrompt"
4. Click Install

### Option 2: For Developers & Contributors
**Build from source to contribute or customize:**
1. Clone this repository: `git clone https://github.com/pascalx-git/SketchPrompt.git`
2. Install dependencies: `npm install`
3. Build the extension: `npm run vscode:prepublish`
4. Package the extension: `npx vsce package`
5. Install the `.vsix` file in any OpenVSX-compatible editor

**Alternative**: Visit [https://sketch-prompt.com](https://sketch-prompt.com) for detailed tutorials and documentation.

## Usage

### Creating a New Sketch

- Open the command palette (`Cmd/Ctrl + Shift + P`)
- Run **"SketchPrompt: New Sketch"**
- Or right-click in the file explorer and select **"SketchPrompt: New Sketch"**
- A new `.sketchprompt` file will be created in the `SketchPrompt` folder
- The file will open in the SketchPrompt editor

*Works in any OpenVSX-compatible editor*

### Editing Sketches

- Open any `.sketchprompt` file to edit it visually
- All changes are auto-saved

### Getting Help

- Run **"SketchPrompt: Help"** from the command palette to open the local `Help.md` file in your workspace.
- The `Help.md` file contains usage tips and a link to the [GitHub repo](https://github.com/pascalx-git/SketchPrompt) for the latest updates.
- Visit [https://sketch-prompt.com](https://sketch-prompt.com) for detailed documentation and tutorials.

*Available in any OpenVSX-compatible editor*

## Working with .sketchprompt Files

- `.sketchprompt` files are automatically opened in the SketchPrompt editor
- **Smart Auto-Save**: Only saves when content actually changes (not on mouse movement)
- **File Watching**: Automatically reloads when files are modified externally
- **JSON Format**: Files contain structured data that can be version controlled and analyzed by AI
- **Visual Feedback**: Real-time status updates and notifications keep you informed
- **Smart Recovery**: Automatic backup and recovery from file corruption

## Development

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

1. Press `F5` in any OpenVSX-compatible editor to launch the extension in debug mode
2. Create a new sketch and test the functionality
3. Check the developer console for any errors

## Architecture

- **Extension**: TypeScript-based VS Code extension (compatible with VS Code-based editors that support OpenVSX, like Cursor IDE, Windsurf, Firebase Studio, etc.)
- **Webview**: React app with TLDraw integration
- **Build**: Vite for webview bundling, TypeScript for extension compilation
- **Auto-Save**: Debounced, content-aware saving with deep equality checks
- **File Watching**: Self-trigger suppression to prevent reload loops


## Security & Privacy

SketchPrompt is built with security-first principles to ensure your sketches and workflow remain safe and private.

### **Security Features**
- **Local-First Architecture**: All sketches stay on your machine with no cloud dependencies
- **Open Source & Auditable**: Full source code available for security review
- **Privacy-Focused**: No data collection or transmission to external services
- **Regular Security Reviews**: Iterative assessments before each release

### **Privacy Commitment**
- **No personal data tracking**: We don't collect user names, emails, or identities
- **No sketch content transmission**: Your drawings never leave your machine
- **No file monitoring**: Individual file names or workspace data are not tracked
- **Local processing**: All functionality runs locally on your device

**📋 [See detailed security information →](SECURITY.md)**

### **Security Features**
- **Content Security Policy (CSP)**: Hardened against XSS attacks
- **Input Validation**: All sketch data validated with JSON schema
- **Path Traversal Protection**: Secure file operations
- **Error Sanitization**: No information leakage in error messages
- **Local Bundling**: Minimal external dependencies

### **Privacy**

SketchPrompt is designed with privacy in mind. All sketch data stays on your local machine and is never sent to external services.

**What We Don't Track:**
- ❌ **Personal data**: No user names, emails, or identities
- ❌ **Sketch content**: Your drawings and sketches are never sent anywhere
- ❌ **File names**: Individual file names or paths are not tracked
- ❌ **Workspace data**: Your project structure or workspace information
- ❌ **AI conversations**: Chat content or prompts are not tracked

**What's Coming:**
- 🔒 **Local-first approach**: All features will prioritize local processing
- 🤝 **Optional collaboration**: Future sharing features will be opt-in only
- 🔐 **End-to-end encryption**: For any future cloud features
- 📊 **Privacy-focused analytics**: If implemented, will be anonymous and optional

## Roadmap

### Current Focus: Core Extension Features
- Stabilizing the core sketching experience
- Improving auto-save reliability
- Enhancing the file format for better AI integration

### Next Phase: AI-Assisted Sketching
- Integrating AI capabilities to analyze sketches
- Generate prompts and provide intelligent suggestions
- AI-powered content analysis based on visual content

### Future Vision: Real-Time Collaboration
- Multi-user sketching with real-time synchronization
- Conflict resolution and version control
- Cloud-based sharing capabilities

## Dependencies

- `tldraw`: Rich sketching library
- `react` & `react-dom`: UI framework
- `vite`: Build tool for the webview
- `typescript`: Extension development

## License

MIT

## Licensing & Attribution

SketchPrompt is licensed under the MIT License. This project bundles the TLDraw SDK, which is licensed separately by tldraw, Inc. and is subject to its own terms. By using SketchPrompt, you agree to comply with both the MIT License and the TLDraw SDK License.

- [See LICENSE file for full details](LICENSE)
- [TLDraw SDK License](https://tldraw.dev/legal/tldraw-license)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in any OpenVSX-compatible editor
5. Submit a pull request

## Links

- **Website**: [https://sketch-prompt.com](https://sketch-prompt.com)
- **GitHub**: [https://github.com/pascalx-git/SketchPrompt](https://github.com/pascalx-git/SketchPrompt)
- **Help**: Run "SketchPrompt: Help" in any OpenVSX-compatible editor or see [Help.md](Help.md)

---

**Version**: 0.2.3 | **Last Updated**: July 31 2024 | **Compatibility**: OpenVSX-compatible editors
