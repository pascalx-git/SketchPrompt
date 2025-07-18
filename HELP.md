# SketchPrompt Help & Usage Guide

## What is SketchPrompt?
SketchPrompt is a Cursor-native extension that lets you sketch ideas, UI flows, and diagrams directly inside Cursor IDE. It uses TLDraw for a rich, visual sketching experience, and is designed for visual thinkers, designers, and developer/design hybrids.

**Website**: [https://sketch-prompt.com](https://sketch-prompt.com)

## Key Features
- **Rich Sketching**: Draw, annotate, and design with TLDraw tools
- **Auto-Save & File Persistence**: Your sketches are saved as `.sketchprompt` files in your workspace
- **AI-Ready**: Sketches are stored in a structured JSON format for easy AI analysis
- **Custom Editor**: Dedicated editor for `.sketchprompt` files
- **Real-time Sync**: Auto-reload when files change externally
- **Status Bar Integration**: Real-time status updates showing save state and file information
- **Error Recovery**: Automatic backup creation and recovery from corrupted files
- **Multi-Channel Feedback**: Toast notifications, status bar, and output channel for comprehensive user feedback
- **Collaboration Ready**: Foundation for future multi-user and AI-assisted sketching

## Installation
1. Clone the repository
2. Run `npm install`
3. Build: `npm run vscode:prepublish`
4. Package: `npx vsce package`
5. Install the `.vsix` file in Cursor IDE

**Alternative**: Visit [https://sketch-prompt.com](https://sketch-prompt.com) for easy installation instructions.

## How to Use
### Creating a New Sketch
- Open the command palette (`Cmd/Ctrl + Shift + P`)
- Run **"SketchPrompt: New Sketch"**
- Or right-click in the file explorer and select **"SketchPrompt: New Sketch"**
- A new `.sketchprompt` file will be created in the `SketchPrompt` folder
- The file opens in the SketchPrompt editor

### Editing Sketches
- Open any `.sketchprompt` file to edit it visually
- All changes are auto-saved
- **Status Bar**: Shows current save state and file information
- **Error Recovery**: If a file becomes corrupted, it's automatically backed up and recovery is attempted
- **Backup Files**: Backup files are created with timestamps (e.g., `sketch.sketchprompt.backup-2024-01-15T10-30-45`) and preserved for user control

### Getting Help
- Run **"SketchPrompt: Help"** from the command palette to open this help file
- [See the README for more details](README.md)
- Visit [https://sketch-prompt.com](https://sketch-prompt.com) for detailed tutorials and documentation

## Roadmap & Vision
- **AI-Assisted Sketching**: Generate prompts and suggestions from your sketches
- **Real-Time Collaboration**: Multi-user sketching and feedback
- **Cloud Sync & Sharing**: Share sketches and sync across devices

## Security & Privacy
SketchPrompt is designed with security and privacy in mind. All sketch data stays on your local machine and is never sent to external services.

### **Security Features**
- **Local-First Architecture**: All processing happens on your machine
- **Open Source**: Full code transparency for security review
- **No Cloud Dependencies**: No external services required for core functionality
- **Regular Security Reviews**: Iterative assessments before each release

### **Privacy Commitment**
- **No Data Collection**: We don't track usage, errors, or personal information
- **No Sketch Transmission**: Your drawings never leave your machine
- **No File Monitoring**: Individual file names or workspace data are not tracked
- **Local Processing**: All functionality runs locally on your device

For detailed security information, see [SECURITY.md](https://github.com/pascalx-git/SketchPrompt/blob/main/SECURITY.md).

## Who is this for?
- UX/product designers
- Prompt engineers
- Developer/design hybrids
- Anyone who thinks visually

## License
MIT

## Links
- **Website**: [https://sketch-prompt.com](https://sketch-prompt.com)
- **GitHub**: [https://github.com/pascalx-git/SketchPrompt](https://github.com/pascalx-git/SketchPrompt)
- **Help**: This file or run "SketchPrompt: Help" in Cursor

---
For the latest updates, see the [GitHub repo](https://github.com/pascalx-git/SketchPrompt) or visit [https://sketch-prompt.com](https://sketch-prompt.com)
