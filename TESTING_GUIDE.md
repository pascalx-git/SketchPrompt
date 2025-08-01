# SketchPrompt Testing Guide

## Overview
This guide provides comprehensive testing scenarios for SketchPrompt releases. Use this checklist before publishing any version to ensure quality and reliability.

## Priority Levels
- **Priority 1 (Must Test)**: Critical functionality that must work for basic usage
- **Priority 2 (Nice to Have)**: Edge cases and advanced scenarios
- **Priority 3 (Future)**: Complex scenarios for future releases

---

## 🚨 Priority 1 - Critical Functionality

### File System Error Handling
- [ ] **Delete file while open**: Open a sketch, delete the file from file explorer, try to save
- [ ] **Permission denied**: Try to save to a read-only directory
- [ ] **Corrupt JSON**: Manually edit a .sketchprompt file to have invalid JSON, then open it
- [ ] **Empty file**: Try to open a completely empty .sketchprompt file
- [ ] **Missing required fields**: Remove essential fields from the JSON structure

### Performance & Memory
- [ ] **Large sketches**: Create a sketch with many elements (100+ shapes)
- [ ] **Multiple sketches open**: Open 5+ sketch files simultaneously
- [ ] **Rapid operations**: Quickly create/delete many sketches

### Core User Workflows
- [ ] **New user flow**: Install → First sketch → Save → Copy to prompt
- [ ] **Basic sketching**: Draw shapes, add text, use all drawing tools
- [ ] **Auto-save functionality**: Verify sketches save automatically
- [ ] **File persistence**: Create sketch, close editor, reopen file

### Different File Locations
- [ ] **Empty workspace**: Test in a completely empty folder
- [ ] **Large project**: Test in a project with 1000+ files
- [ ] **Git repository**: Test in a git repo with many branches
- [ ] **Different folder locations**: Create sketches in root, subfolders, nested folders

---

## 🔶 Priority 2 - Edge Cases & Advanced Scenarios

### UI Edge Cases
- [ ] **Window resize**: Resize the editor window while sketching
- [ ] **Theme switching**: Switch between light/dark themes while sketching
- [ ] **High DPI**: Test on high-resolution displays
- [ ] **Special characters**: Test with folder names like "test-folder (1)" or "my project"
- [ ] **Long paths**: Test in deeply nested folders

### Advanced File System
- [ ] **Disk full**: Simulate disk space issues (hard to test, but good to know)
- [ ] **Network drive disconnection**: If saving to network drive
- [ ] **Multi-root workspace**: Test in a workspace with multiple folders

### User Workflows
- [ ] **Power user flow**: Multiple sketches → Complex drawings → Export
- [ ] **Collaboration flow**: Share sketch files with others
- [ ] **Different editors**: Test in Cursor IDE vs Windsurf (if you have both)

---

## 🔵 Priority 3 - Future Testing

### Complex Scenarios
- [ ] **Memory stress test**: Create extremely large sketches (500+ elements)
- [ ] **Concurrent editing**: Multiple users editing same file (future feature)
- [ ] **Version control integration**: Test with git operations on sketch files
- [ ] **Backup and recovery**: Test automatic backup creation and restoration

### Integration Testing
- [ ] **Extension conflicts**: Test with other popular extensions
- [ ] **Workspace settings**: Test with various VS Code workspace configurations
- [ ] **Language support**: Test with non-English file paths and content

---

## 🎯 Quick Test Checklist

### Before Every Release
**Priority 1 (Must Test):**
- [ ] Corrupt JSON file handling
- [ ] Large sketch performance (100+ elements)
- [ ] Multiple sketches open (5+ files)
- [ ] Different folder locations (root, subfolders, nested)
- [ ] Basic user workflow (install → sketch → save → copy)
- [ ] Auto-save functionality
- [ ] File persistence across editor restarts

**Priority 2 (Nice to Have):**
- [ ] Window resize behavior
- [ ] Theme switching (light/dark)
- [ ] Special character file names
- [ ] High DPI display testing
- [ ] Permission denied scenarios

---

## Testing Environment Setup

### Required Test Environments
- [ ] **Cursor IDE**: Primary testing environment
- [ ] **Windsurf**: Secondary testing environment (if available)
- [ ] **VS Code**: Baseline testing environment
- [ ] **High DPI Display**: For resolution testing
- [ ] **Different OS**: Windows, macOS, Linux (if possible)

### Test Data Preparation
- [ ] **Corrupt files**: Create .sketchprompt files with invalid JSON
- [ ] **Large sketches**: Pre-create sketches with 100+ elements
- [ ] **Empty files**: Create completely empty .sketchprompt files
- [ ] **Special characters**: Create folders with special characters in names

---

## Bug Reporting Template

When reporting bugs found during testing:

```
**Bug Title**: [Brief description]

**Priority**: [1/2/3]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Environment**:
- Editor: [Cursor IDE/Windsurf/VS Code]
- OS: [Windows/macOS/Linux]
- Extension Version: [Version number]

**Additional Notes**: [Any relevant details]
```

---

## Performance Benchmarks

### Acceptable Performance Metrics
- **Extension size**: < 5MB
- **Load time**: < 3 seconds
- **Memory usage**: < 100MB for large sketches
- **Auto-save delay**: 500ms - 10 seconds
- **File operations**: < 1 second for normal files

### Performance Testing Checklist
- [ ] Extension loads within 3 seconds
- [ ] Large sketches (100+ elements) remain responsive
- [ ] Memory usage stays reasonable during extended use
- [ ] Auto-save doesn't cause UI lag
- [ ] File operations complete quickly

---

## Security Testing

### Security Scenarios to Test
- [ ] **Path traversal**: Attempt to access files outside workspace
- [ ] **Input validation**: Test with malformed sketch data
- [ ] **CSP compliance**: Verify no unsafe directives
- [ ] **Error sanitization**: Ensure no sensitive data in error messages

---

**Last Updated**: August 1, 2025  
**Version**: 0.2.4  
**Next Review**: Before v0.2.5 release 