# SketchPrompt Help & Usage Guide

[![Version](https://img.shields.io/badge/version-0.2.3-blue.svg?labelColor=%23cccccc&color=%233b82f6)](https://github.com/pascalx-git/SketchPrompt)
[![License](https://img.shields.io/badge/license-MIT-green.svg?labelColor=%23cccccc&color=%233b82f6)](LICENSE)
[![Open VSX Downloads](https://img.shields.io/open-vsx/dt/PascalX/SketchPrompt?labelColor=%23cccccc&color=%233b82f6)](https://open-vsx.org/extension/PascalX/SketchPrompt)
[![Open VSX Rating](https://img.shields.io/open-vsx/stars/PascalX/SketchPrompt?labelColor=%23cccccc&color=%233b82f6)](https://open-vsx.org/extension/PascalX/SketchPrompt)
[![Open VSX Release Date](https://img.shields.io/open-vsx/release-date/PascalX/SketchPrompt?labelColor=%23cccccc&color=%233b82f6)](https://open-vsx.org/extension/PascalX/SketchPrompt)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/PascalX-Git/SketchPrompt?labelColor=%23cccccc&color=%233b82f6)](https://github.com/pascalx-git/SketchPrompt)

## What is SketchPrompt?
SketchPrompt is a visual thinking tool for coding with AI. Sketch ideas and use them in your prompts to improve your workflow with AI models. Works in OpenVSX-compatible editors like Cursor, Windsurf, Firebase Studio, etc.

**Website**: [https://sketch-prompt.com](https://sketch-prompt.com)

## Key Features
- **Rich Sketching**: Full sketching canvas integration with shapes, text, drawing tools, and more
- **AI-Ready**: Structured format for future AI analysis and collaboration 
- **File Persistence**: Save and load sketches as `.sketchprompt` files with version control
- **Copy to Prompt**: Copy or export sketches as images and seamlessly insert into your prompts
- **Custom Editor**: Dedicated editor for `.sketchprompt` files
- **Auto-Save**: Your work is automatically saved as you sketch
- **Smart Recovery**: Automatic backup and recovery from file corruption
- **Visual Feedback**: Real-time status updates and notifications keep you informed
- **JSON Format**: Files contain structured data that can be version controlled and analyzed by AI
- **Collaboration Ready**: Foundation for multi-user and AI-assisted sketching

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

## How to Use

### Creating a New Sketch
- Open the command palette (`Cmd/Ctrl + Shift + P`)
- Run **"SketchPrompt: New Sketch"**
- Or right-click in the file explorer and select **"SketchPrompt: New Sketch"**
- A new `.sketchprompt` file will be created in the `SketchPrompt` folder
- The file opens in the SketchPrompt editor

*Works in any OpenVSX-compatible editor*

### Editing Sketches
- Open any `.sketchprompt` file to edit it visually
- All changes are auto-saved
- **Status Bar**: Shows current save state and file information
- **Error Recovery**: If a file becomes corrupted, it's automatically backed up and recovery is attempted
- **Backup Files**: Backup files are created with timestamps (e.g., `sketch.sketchprompt.backup-2024-01-15T10-30-45`) and preserved for user control

### Copy to Prompt Feature
- **Export as Image**: Use the export function to save your sketch as an image
- **Copy to Clipboard**: Copy your sketch directly to paste into any AI chat or application
- **Seamless Integration**: Paste sketches directly into your AI prompts for visual context
- **Multiple Formats**: Export in various formats for different use cases

## Common Use Cases

### AI Prompt Enhancement
Sketch your ideas, then copy them directly into AI chats:
- **ChatGPT Integration**: Show your UI concepts, data flows, or logic diagrams instead of typing long explanations
- **Claude Conversations**: Include visual context in your AI discussions for better understanding
- **Code Generation**: Show AI your interface ideas before writing code
- **Visual Communication**: Replace text-heavy prompts with simple sketches

### Quick UI Wireframes
Rapidly sketch interface layouts and component designs:
- **Rapid Prototyping**: Quickly mock up interface designs before coding
- **Component Planning**: Sketch individual UI components and their relationships
- **Layout Exploration**: Try different arrangements and structures
- **AI Communication**: Explain interface concepts to AI coding assistants

### Data Flows & Logic
Map out simple data flows, API structures, and decision logic:
- **API Planning**: Sketch data structures and endpoint relationships
- **Feature Planning**: Visualize how new features will work
- **Debugging**: Map out complex logic flows to identify issues
- **System Architecture**: Show AI your system design ideas

### Code Planning
Sketch out architecture, component relationships, or algorithm logic:
- **Architecture Design**: Plan component relationships and data flow
- **Algorithm Logic**: Visualize complex algorithms before implementation
- **Database Design**: Sketch entity relationships and data models
- **AI Collaboration**: Communicate technical concepts to AI assistants

### Getting Help
- Run **"SketchPrompt: Help"** from the command palette to open this help file
- [See the README for more details](README.md)
- Visit [https://sketch-prompt.com](https://sketch-prompt.com) for detailed tutorials and documentation

*Available in any OpenVSX-compatible editor*

## Troubleshooting

### Common Issues

#### **Sketch Not Saving**
- Check the status bar for save status indicators
- Ensure you have write permissions in your workspace
- Try creating a new sketch file to test

#### **Editor Not Opening**
- Restart your OpenVSX-compatible editor
- Check if the extension is properly installed
- Run "SketchPrompt: Help" to verify installation

#### **File Corruption Recovery**
- Backup files are automatically created with timestamps
- Check for `.backup-YYYY-MM-DDTHH-MM-SS` files in your workspace
- The extension will attempt automatic recovery and notify you

#### **Performance Issues**
- Close other large files or applications
- Restart your OpenVSX-compatible editor if sketches become unresponsive
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
- **Help**: This file or run "SketchPrompt: Help" in any OpenVSX-compatible editor
- **Release Notes**: [CHANGELOG.md](CHANGELOG.md)

---
For the latest updates, see the [GitHub repo](https://github.com/pascalx-git/SketchPrompt) or visit [https://sketch-prompt.com](https://sketch-prompt.com)
