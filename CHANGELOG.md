# SketchPrompt Release Notes

## Introduction
SketchPrompt is a powerful Cursor IDE extension for visual thinking and AI prompting—best used for quickly sketching ideas and intent to make human-AI collaboration more seamless. With SketchPrompt, you can visually communicate, iterate, and share ideas directly inside your coding workflow.

---

## v0.2.0 – Analytics, Security & Reliability Improvements

This release makes SketchPrompt more reliable with critical bug fixes and introduces anonymous analytics to improve the extension. Your sketches stay private while helping us build better features.

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

####  **Analytics & Privacy**
- **Privacy-Focused Analytics**: Implemented anonymous usage tracking via Umami Cloud to help improve the extension
- **Feature Usage Tracking**: Monitor which features are used most to prioritize development
- **Error Monitoring**: Track error patterns to identify and fix issues quickly
- **Privacy Protection**: No personal data, sketch content, or file names are ever tracked
- **Optional Tracking**: Analytics can be disabled by developers building from source

---

## v0.1.0 – Initial Public Alpha Release

Welcome to the very first public release of SketchPrompt! This alpha version lays the foundation for a seamless visual sketching experience inside Cursor, designed for developers, designers, and anyone who thinks with visuals as well as words.

### What's New in 0.1.0

- **Rich Sketching Canvas**: Draw, annotate, and design with TLDraw-powered tools—shapes, text, freehand, and more.
- **Instant File Creation**: Create new `.sketchprompt` files from the command palette or by right-clicking in the file explorer.
- **Custom Editor**: Dedicated editor for `.sketchprompt` files with real-time, auto-saving and syntax highlighting.
- **Robust Auto-Save**: Content-aware, debounced auto-save ensures your sketches are always up to date without unnecessary writes.
- **File Persistence**: All sketches are saved as `.sketchprompt` files in your workspace for easy version control and sharing.
- **Copy to Prompt**: Export sketches as images and paste them directly into Cursor Chat or your documents.
- **Help & Documentation**: Access a local `Help.md` file for quick tips, usage, and links to the latest updates.
- **AI-Ready Format**: Sketches are stored in a structured JSON format, ready for future AI analysis and collaboration features.
- **Real-Time Sync**: Automatic reload when files are changed externally.
- **Foundations for Collaboration**: The architecture is ready for future multi-user and AI-assisted sketching.

---

**Note:** This is an early alpha release. Additional security features, advanced collaboration, and cloud sync are planned for future updates. Feedback and contributions are welcome!

---

## See Also
- [README.md](README.md) – Full usage, installation, and feature guide
- [Help.md](Help.md) – Quick help and tips inside your workspace 