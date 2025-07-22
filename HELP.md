# SketchPrompt Help & Usage Guide

**Version**: 0.2.2 | **Last Updated**: July 2024 | **Compatibility**: Cursor IDE

## What is SketchPrompt?
SketchPrompt is a powerful Cursor IDE extension for visual thinking and AI prompting—best used for quickly sketching ideas and intent to make human-AI collaboration more seamless. Sketch > Copy > Paste into Cursor Chat. Done.

**Website**: [https://sketch-prompt.com](https://sketch-prompt.com)

## Key Features
- **Rich Sketching**: Full sketching canvas integration with shapes, text, drawing tools, and more
- **AI-Ready**: Structured format for future AI analysis and collaboration
- **File Persistence**: Save and load sketches as `.sketchprompt` files with version control
- **Copy to Prompt**: Copy or export sketches as images and seamlessly insert into your prompts
- **Custom Editor**: Dedicated editor for `.sketchprompt` files
- **Auto-Save**: Your work is automatically saved as you sketch
- **Status Bar Integration**: Real-time status updates showing save state and file information
- **Error Recovery**: Automatic backup creation and recovery from corrupted files
- **Multi-Channel Feedback**: Toast notifications, status bar, and output channel for comprehensive user feedback
- **Collaboration Ready**: Foundation for multi-user and AI-assisted sketching

## Installation

### Option 1: For Cursor IDE Users
**Install SketchPrompt to start sketching:**

#### Option 1a: Install from Cursor IDE Extensions
1. Open Cursor IDE
2. Go to Extensions (Cmd/Ctrl + Shift + X)
3. Search for "SketchPrompt"
4. Click Install

#### Option 1b: Install from GitHub Releases
1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/pascalx-git/SketchPrompt/releases)
2. Open Cursor IDE
3. Go to Extensions (Cmd/Ctrl + Shift + X)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file
6. Restart Cursor IDE when prompted

### Option 2: For Developers & Contributors
**Build from source to contribute or customize:**
1. Clone this repository: `git clone https://github.com/pascalx-git/SketchPrompt.git`
2. Install dependencies: `npm install`
3. Build the extension: `npm run vscode:prepublish`
4. Package the extension: `npx vsce package`
5. Install the `.vsix` file in Cursor IDE

**Alternative**: Visit [https://sketch-prompt.com](https://sketch-prompt.com) for detailed tutorials and documentation.

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

### Copy to Prompt Feature
- **Export as Image**: Use the export function to save your sketch as an image
- **Copy to Clipboard**: Copy your sketch directly to paste into Cursor Chat or other applications
- **Seamless Integration**: Paste sketches directly into your AI prompts for visual context
- **Multiple Formats**: Export in various formats for different use cases

### Getting Help
- Run **"SketchPrompt: Help"** from the command palette to open this help file
- [See the README for more details](README.md)
- Visit [https://sketch-prompt.com](https://sketch-prompt.com) for detailed tutorials and documentation

## Troubleshooting

### Common Issues

#### **Sketch Not Saving**
- Check the status bar for save status indicators
- Ensure you have write permissions in your workspace
- Try creating a new sketch file to test

#### **Editor Not Opening**
- Restart Cursor IDE
- Check if the extension is properly installed
- Run "SketchPrompt: Help" to verify installation

#### **File Corruption Recovery**
- Backup files are automatically created with timestamps
- Check for `.backup-YYYY-MM-DDTHH-MM-SS` files in your workspace
- The extension will attempt automatic recovery and notify you

#### **Performance Issues**
- Close other large files or applications
- Restart Cursor IDE if sketches become unresponsive
- Check available system memory

### Getting More Help
- Check the [GitHub Issues](https://github.com/pascalx-git/SketchPrompt/issues) for known problems
- Review the [CHANGELOG.md](CHANGELOG.md) for recent updates and fixes
- Visit [https://sketch-prompt.com](https://sketch-prompt.com) for additional support

## Roadmap & Vision
- **AI-Assisted Sketching**: Generate prompts and suggestions from your sketches
- **Real-Time Collaboration**: Multi-user sketching and feedback
- **Cloud Sync & Sharing**: Share sketches and sync across devices

## Security & Privacy
SketchPrompt is built with security-first principles. All sketch data stays on your local machine with no cloud dependencies.

### **Key Security Features**
- **Local-First Architecture**: All processing happens on your machine
- **Open Source & Auditable**: Full code transparency for security review
- **No Data Collection**: We don't track usage, errors, or personal information
- **No Sketch Transmission**: Your drawings never leave your machine

For detailed security information, see [SECURITY.md](https://github.com/pascalx-git/SketchPrompt/blob/main/SECURITY.md).

## Who is this for?
- UX/product designers
- Prompt engineers
- Developer/design hybrids
- Anyone who thinks visually

## Version History
For detailed release notes and what's new in each version, see [CHANGELOG.md](CHANGELOG.md).

### Recent Updates (v0.2.2)
- **Multi-Channel User Feedback System**: Status bar integration and enhanced notifications
- **Robust Error Recovery**: Automatic backup creation and smart recovery from corrupted files
- **Enhanced File Management**: Improved file watching and debug logging
- **Security & Stability**: Error sanitization and memory management improvements

## License
MIT

## Links
- **Website**: [https://sketch-prompt.com](https://sketch-prompt.com)
- **GitHub**: [https://github.com/pascalx-git/SketchPrompt](https://github.com/pascalx-git/SketchPrompt)
- **Help**: This file or run "SketchPrompt: Help" in Cursor
- **Release Notes**: [CHANGELOG.md](CHANGELOG.md)

---
For the latest updates, see the [GitHub repo](https://github.com/pascalx-git/SketchPrompt) or visit [https://sketch-prompt.com](https://sketch-prompt.com)
