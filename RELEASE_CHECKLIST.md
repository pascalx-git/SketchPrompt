# SketchPrompt Release Checklist

## Pre-Release Testing
- [ ] **Complete testing validation**
  - [ ] Follow [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive test scenarios
  - [ ] Verify all Priority 1 tests pass
  - [ ] Test in primary environment (Cursor IDE)
  - [ ] Validate performance benchmarks are met
  - [ ] Confirm security tests pass

## Documentation Updates
- [ ] **Update CHANGELOG.md**
  - [ ] Add new version section with user-centered release notes
  - [ ] Include all major changes, bug fixes, and improvements
  - [ ] Focus on user benefits and experience improvements
- [ ] **Update README.md**
  - [ ] Verify installation instructions are current
  - [ ] Update feature descriptions if needed
  - [ ] Check all links and references
- [ ] **Update HELP.md**
  - [ ] Add any new features or changes
  - [ ] Update troubleshooting section
- [ ] **Update package.json**
  - [ ] Increment version number following SemVer rules
  - [ ] Update package-lock.json to match
- [ ] **Review SemVer compliance**: Check [semver.org](https://semver.org/) to ensure version increment matches change type (MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes)

## Publishing Process
- [ ] **Publish to OpenVSX** (primary distribution)
  - [ ] Build extension with `npm run vscode:prepublish`
  - [ ] Package with `npx vsce package`
  - [ ] Publish to OpenVSX with `npx ovsx publish`
  - [ ] Update marketplace description if needed
- [ ] **Push to GitHub** (source code)
  - [ ] Commit all changes with descriptive message
  - [ ] Push to main branch
  - [ ] Update website repo if needed

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

## Current Status for v0.2.4
- [x] Extension built and packaged
- [x] Code committed and pushed to GitHub
- [x] Website updated and deployed
- [x] OpenVSX badges and marketing updates completed
- [x] SemVer compliance verified 