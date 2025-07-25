# SketchPrompt Release Checklist

## Pre-Release Testing
- [ ] **Test the extension locally**
  - [ ] Install the built `.vsix` file in Cursor IDE/Windsurf
  - [ ] Test all core functionality (sketching, saving, loading)
  - [ ] Test error handling and edge cases
  - [ ] Verify analytics integration works correctly
  - [ ] Test on different file types and scenarios

## Documentation Updates
- [ ] **Update Release.md**
  - [ ] Add new version section with user-centered release notes
  - [ ] Include all major changes, bug fixes, and improvements
  - [ ] Focus on user benefits and experience improvements
- [ ] **Update README.md**
  - [ ] Verify installation instructions are current
  - [ ] Update feature descriptions if needed
  - [ ] Check all links and references
- [ ] **Update Help.md**
  - [ ] Add any new features or changes
  - [ ] Update troubleshooting section
- [ ] **Update package.json**
  - [ ] Increment version number
  - [ ] Update changelog if applicable

## GitHub Release Process
- [ ] **Create GitHub Release**
  - [ ] Tag the release with version number (e.g., `v0.2.0`)
  - [ ] Upload the `.vsix` file as release asset
  - [ ] Write comprehensive release notes
  - [ ] Include installation instructions
  - [ ] Mark as latest release if stable
- [ ] **Update OpenVSX and extension marketplaces** (when ready)
  - [ ] Publish new version to marketplace
  - [ ] Update marketplace description if needed

## Post-Release
- [ ] **Monitor analytics** for any issues
- [ ] **Check GitHub Issues** for user feedback
- [ ] **Update roadmap** based on user feedback
- [ ] **Plan next release** features and timeline

## Quality Gates
- [ ] All tests pass locally
- [ ] Extension size is reasonable (< 5MB)
- [ ] No critical security vulnerabilities
- [ ] Documentation is complete and accurate
- [ ] Release notes are user-focused and clear

---

## Current Status for v0.2.0
- [x] Extension built and packaged (2.85MB)
- [x] Code committed and pushed to GitHub
- [x] Website updated and deployed
- [ ] **PENDING**: Local testing
- [ ] **PENDING**: GitHub release creation 