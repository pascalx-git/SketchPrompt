# SketchPrompt Release Notes

## Introduction
Visual thinking for coding with AI. Sketch ideas and use them in your prompts to improve your workflow with AI models. Works in OpenVSX-compatible editors like Cursor, Windsurf, Firebase Studio, etc.

### See Also
- [README.md](README.md) – Full usage, installation, and feature guide
- [HELP.md](HELP.md) – Quick help and tips inside your workspace 

---

## v0.2.5 – Enhanced Website Navigation & User Experience

**Released:** *Draft - August 14, 2025*

This release improves the website user experience with enhanced navigation functionality and better tab management for the demo section.

### What's New in 0.2.5

- **Improved Demo Access**: Demo content is now easier to find and access from the main navigation
- **Enhanced Analytics**: Improved analytics and tracking throughout the website for better insights

---

## v0.2.4 – Universal Editor Support & Enhanced Experience

**Released:** August 1, 2025

This release expands SketchPrompt's reach to all OpenVSX-compatible editors and improves discoverability with enhanced badges and documentation. Your visual thinking tool is now available to a much wider audience of developers and designers.

### What's New in 0.2.4

#### **Universal OpenVSX Compatibility**
- **Multi-Editor Support**: SketchPrompt now works in any editor that supports OpenVSX extensions, including Cursor IDE, Windsurf, Google Firebase Studio, and more
- **Unified Installation**: Same powerful features across all compatible editors with consistent installation process
- **Broader Accessibility**: Reach more users who prefer different development environments

#### **Enhanced Discoverability & Trust**
- **OpenVSX Badges**: Added download count, rating, and release date badges to showcase extension popularity and reliability
- **Visual Credibility**: Real-time metrics help users understand the extension's adoption and community trust
- **Professional Presentation**: Updated badge styling with consistent blue theme for better visual appeal

#### **Documentation & Marketing Improvements**
- **Updated Descriptions**: Clear messaging about OpenVSX compatibility and multi-editor support
- **Enhanced Website**: Improved visual styles and user experience on the marketing website
- **Better Positioning**: Emphasizes the extension's value for visual thinking across all development workflows

#### **Technical Enhancements**
- **Package Updates**: Updated dependencies to latest secure versions
- **Build Optimization**: Streamlined build process and improved performance
- **Code Quality**: Removed console logs and optimized JavaScript for better performance
- **File Persistence Fix**: Implemented unique persistence keys to prevent file conflicts when creating multiple sketch files
- **Bug Fix**: Fixed issue where recreated files with same name would restore old content from browser storage
- **Enhanced File Path Validation**: Robust file existence and permission checks with user-friendly error messages
- **Improved Auto-Save Performance**: Smart save timing with minimum/maximum intervals and save frequency tracking
- **Better Error Handling**: Comprehensive file path validation and graceful error recovery

---

## v0.2.3 – Windsurf Compatibility

**Released:** July 25, 2025

This release adds full compatibility with Windsurf, making SketchPrompt available to both Cursor IDE and Windsurf users. The extension now works seamlessly across both platforms with the same powerful features.

### What's New in 0.2.3

#### **Windsurf Support**
- **Full Windsurf Compatibility**: SketchPrompt now works natively in Windsurf with all existing features
- **Unified Experience**: Same installation process, commands, and functionality across both Cursor IDE and Windsurf
- **Updated Documentation**: All documentation, help files, and marketing materials updated to include Windsurf users
- **Extension Marketplace**: Available in both Cursor IDE and Windsurf extension marketplaces

#### **Documentation Overhaul**
- **Multi-Platform Instructions**: Installation guides now cover both Cursor IDE and Windsurf
- **Updated Marketing**: Website and all promotional materials updated to target both user bases
- **Enhanced Badges**: Added Windsurf compatibility badge alongside existing Cursor IDE badge

---

## v0.2.2 – Enhanced User Feedback & Error Recovery

**Released:** July 18, 2025

This release improves the user experience with comprehensive feedback systems and robust error recovery. Your sketches are now more protected and you'll always know what's happening.

### What's New in 0.2.2

#### **Multi-Channel User Feedback System**
- **Status Bar Integration**: Real-time status updates showing save state, file information, and recovery states
- **Enhanced Notifications**: Toast messages, status bar updates, and output channel logging for maximum visibility
- **Recovery Indicators**: Clear visual feedback when files are recovered from corruption
- **Save Status Updates**: Immediate feedback during save operations with status indicators

#### **Robust Error Recovery & Backup System**
- **Automatic Backup Creation**: Corrupted files are automatically backed up before recovery attempts
- **Smart Recovery**: Attempts partial JSON recovery to preserve as much data as possible
- **User Control**: All backup files are preserved for user control (no automatic deletion)
- **Backup Naming**: Timestamped backup files (e.g., `sketch.sketchprompt.backup-2024-01-15T10-30-45`)
- **Recovery Feedback**: Multiple notification channels inform users of recovery status and backup locations

#### **Enhanced File Management**
- **Improved File Watching**: Better handling of external file changes with user choice for reloading
- **Debug Logging**: Enhanced logging for troubleshooting status bar and file operations

#### **Security & Stability Improvements**
- **Error Sanitization**: Improved error messages without information leakage
- **Memory Management**: Proper cleanup of timeouts and resources to prevent memory leaks

#### **Visual & UX Enhancements**
- **Marketplace Badges**: Updated badges for version, license, Cursor IDE, and TLDraw integration

---

## v0.2.1 – Marketplace & Documentation Updates

**Released:** July 16, 2025

- Updated extension description and marketplace metadata for better discoverability
- Added comprehensive security messaging to website and documentation

---

## v0.2.0 – Security & Reliability Improvements

**Released:** July 16, 2025

This release makes SketchPrompt more reliable with critical bug fixes and enhanced security features. Your sketches are now more secure and the extension is more stable.

### What's New in 0.2.0

####  **Critical Bug Fixes**
- **Fixed Custom Editor Registration**: Resolved the issue where sketches weren't saving properly and the editor wasn't displaying correctly. Your sketches now persist reliably and the interface works as expected.
- **Improved File Persistence**: Enhanced the auto-save mechanism to ensure your work is never lost, even during unexpected interruptions.
- **Better Error Handling**: More graceful handling of edge cases and improved error messages to help you troubleshoot any issues.

####  **Security Enhancements**
- **Comprehensive Security Analysis**: Conducted thorough security review of all dependencies and code paths to ensure your sketches and workspace remain secure.
- **Updated Dependencies**: Upgraded all packages to their latest secure versions, protecting against known vulnerabilities.
- **Input Validation**: Added robust input validation to prevent potential security issues when working with sketch files.

####  **User Experience Improvements**
- **Enhanced Visual Feedback**: Better loading states and visual indicators when sketches are being saved or loaded.
- **Improved File Management**: More intuitive handling of `.sketchprompt` files with better integration into your existing workflow.
- **Streamlined Installation**: Simplified the installation process for a smoother setup experience.

####  **Performance Optimizations**
- **Faster Loading**: Reduced initialization time so you can start sketching immediately.
- **Memory Efficiency**: Optimized memory usage for better performance with large sketches.
- **Smoother Interactions**: Improved responsiveness when drawing and editing complex sketches.

####  **Documentation Updates**
- **Updated Help System**: Enhanced the built-in help documentation with more detailed instructions and troubleshooting tips.
- **Better Examples**: Added more comprehensive examples to help you get started quickly.

---

## v0.1.0 – Initial Public Alpha Release

**Released:** July 8, 2025 

Welcome to the very first public release of SketchPrompt! This alpha version lays the foundation for a seamless visual sketching experience inside Cursor IDE and Windsurf, designed for developers, designers, and anyone who thinks with visuals as well as words.

### What's New in 0.1.0

- **Rich Sketching Canvas**: Draw, annotate, and design with TLDraw-powered tools—shapes, text, freehand, and more.
- **Instant File Creation**: Create new `.sketchprompt` files from the command palette or by right-clicking in the file explorer.
- **Custom Editor**: Dedicated editor for `.sketchprompt` files with real-time, auto-saving and syntax highlighting.
- **Robust Auto-Save**: Content-aware, debounced auto-save ensures your sketches are always up to date without unnecessary writes.
- **File Persistence**: All sketches are saved as `.sketchprompt` files in your workspace for easy version control and sharing.
- **Copy to Prompt**: Export sketches as images and paste them directly into Cursor Chat, Windsurf, or your documents.
- **Help & Documentation**: Access a local `Help.md` file for quick tips, usage, and links to the latest updates.
- **AI-Ready Format**: Sketches are stored in a structured JSON format, ready for future AI analysis and collaboration features.
- **Real-Time Sync**: Automatic reload when files are changed externally.
- **Foundations for Collaboration**: The architecture is ready for future multi-user and AI-assisted sketching.

---
