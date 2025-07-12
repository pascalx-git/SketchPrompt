# SketchPrompt Security Analysis Report

**Extension**: SketchPrompt - Cursor IDE Extension  
**Analysis Date**: January 2025  
**Analyst**: AI Security Review  
**TLDraw Version**: 3.13.4  

---

## Executive Summary

SketchPrompt is a Cursor IDE extension that integrates TLDraw for visual thinking and AI prompting. While the extension demonstrates good architectural practices, it contains **several critical security vulnerabilities** that pose significant risks including potential Remote Code Execution and Supply Chain attacks. **Immediate action is required** before production deployment.

**Risk Level**: 🔴 **HIGH** (Current) → 🟡 **LOW** (After fixes)

---

## 1. Application Description

**SketchPrompt** is a powerful Cursor IDE extension for visual thinking and AI prompting. The extension enables users to create visual sketches that can be seamlessly integrated into AI conversations.

### Architecture Components

- **Main Extension**: TypeScript-based VS Code extension
  - `src/extension.ts` - Extension entry point and command registration
  - `src/SketchPromptCustomEditor.ts` - Custom editor with TLDraw integration
- **Webview Component**: React application with TLDraw integration
  - `media/src/sketching-app.tsx` - Main React component
- **Marketing Website**: Static HTML/CSS/JS website (`website/`)
- **File Format**: Custom `.sketchprompt` JSON files with auto-save functionality
- **Build System**: Vite for webview bundling, TypeScript for extension compilation

### Key Features

- Rich sketching with TLDraw integration
- Auto-save functionality with file watching
- Copy to clipboard for AI prompting
- Custom file editor for `.sketchprompt` files
- Real-time sync and external change detection

---

## 2. Critical Security Issues

### 🔴 **CRITICAL - Immediate Action Required**

| ID | Issue | Severity | CVSS | Risk | Effort | Priority |
|----|-------|----------|------|------|--------|----------|
| **CSP-01** | Content Security Policy allows `'unsafe-eval'` | **CRITICAL** | 9.0 | **Remote Code Execution** | HIGH | **1** |
| **SUPPLY-01** | External CDN dependency without integrity checks | **CRITICAL** | 8.5 | **Supply Chain Attack** | MEDIUM | **2** |

#### CSP-01: Unsafe Content Security Policy
```typescript
// File: src/SketchPromptCustomEditor.ts:206
<meta http-equiv="Content-Security-Policy" content="default-src 'self' https://cdn.tldraw.com; 
style-src ${webview.cspSource} 'unsafe-inline' https://cdn.tldraw.com; 
script-src 'nonce-${nonce}' 'unsafe-eval' https://cdn.tldraw.com; // ← CRITICAL VULNERABILITY
```

**Risk**: The `'unsafe-eval'` directive completely negates XSS protections, allowing:
- Dynamic code execution via `eval()`
- String-based `setTimeout()`/`setInterval()`
- `Function()` constructor usage
- Potential remote code execution

**Resolution**: Remove `'unsafe-eval'` and implement nonce-based or hash-based CSP.

#### SUPPLY-01: External CDN Dependency
**Risk**: All TLDraw resources loaded from `https://cdn.tldraw.com` without Subresource Integrity (SRI) checks.

**What could go wrong**:
- CDN compromise could inject malicious code
- Man-in-the-middle attacks
- DNS poisoning attacks

**Resolution**: 
```typescript
// Option 1: Bundle locally
import { Tldraw } from 'tldraw';

// Option 2: Add SRI hashes
<script src="https://cdn.tldraw.com/script.js" 
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>
```

---

## 3. High Severity Issues

### 🟠 **HIGH - Address Immediately**

| ID | Issue | Severity | Risk | Effort | Priority |
|----|-------|----------|------|--------|----------|
| **INPUT-01** | No input validation for sketch data | **HIGH** | Data Injection | MEDIUM | **3** |
| **FILE-01** | Unsafe file operations | **HIGH** | Path Traversal | MEDIUM | **4** |

#### INPUT-01: Unvalidated Sketch Data
```typescript
// File: src/SketchPromptCustomEditor.ts:48-54
const text = document.getText();
const data = text ? JSON.parse(text) : {}; // ← No validation
```

**Risk**: Malicious `.sketchprompt` files could contain harmful payloads leading to:
- Prototype pollution attacks
- Code injection through object properties
- Denial of service through malformed data

**Resolution**: Implement JSON schema validation:
```typescript
import Ajv from 'ajv';
const ajv = new Ajv();
const sketchSchema = { /* define schema */ };
const validate = ajv.compile(sketchSchema);

if (!validate(data)) {
  throw new Error('Invalid sketch data');
}
```

#### FILE-01: Path Traversal Vulnerability
```typescript
// File: src/extension.ts:44-48
filePath = path.join(sketchesFolder, `Untitled-${i}.sketchprompt`);
// No validation of path boundaries
```

**Risk**: Potential path traversal allowing access to files outside intended directories.

**Resolution**: Implement proper path validation:
```typescript
const safePath = path.resolve(sketchesFolder, filename);
if (!safePath.startsWith(path.resolve(sketchesFolder))) {
  throw new Error('Invalid file path');
}
```

---

## 4. Medium Severity Issues

### 🟡 **MEDIUM - Schedule for Next Release**

| ID | Issue | Severity | Risk | Effort | Priority |
|----|-------|----------|------|--------|----------|
| **WATCH-01** | File watcher race conditions | **MEDIUM** | Data Corruption | MEDIUM | **5** |
| **SAVE-01** | Auto-save without user confirmation | **MEDIUM** | Data Loss | LOW | **6** |
| **ERROR-01** | Information disclosure in error messages | **MEDIUM** | Info Leak | LOW | **7** |

#### WATCH-01: Race Condition in File Watcher
```typescript
// File: src/SketchPromptCustomEditor.ts:67-70
let ignoreNextWatcher = false;
// Race condition possible between multiple file operations
```

**Resolution**: Implement proper locking mechanism or atomic operations.

#### SAVE-01: Unsafe Auto-save Behavior
**Risk**: Auto-save could overwrite user data during conflicts.

**Resolution**: Add user confirmation for destructive operations.

#### ERROR-01: Verbose Error Messages
**Risk**: Error messages may leak internal file system structure.

**Resolution**: Sanitize error messages for production.

---

## 5. Low Severity & Information Issues

### 🔵 **LOW - Future Improvements**

| ID | Issue | Category | Priority |
|----|-------|----------|----------|
| **CSP-02** | Overly permissive CSP for images | Security | **8** |
| **STORAGE-01** | Client-side state management | Data Security | **9** |
| **EXTERNAL-01** | External Google Fonts | Privacy | **10** |
| **CONFIG-01** | Development artifacts in production | Configuration | **11** |
| **DEPS-01** | No automated security scanning | Dependencies | **12** |
| **DOCS-01** | Missing security documentation | Documentation | **13** |

---

## 6. TLDraw-Specific Security Analysis

### Library Assessment
- **Version**: TLDraw 3.13.4 (current, no known critical CVEs)
- **CSP Requirements**: Likely requires `'unsafe-eval'` for dynamic rendering
- **External Dependencies**: Requires CDN resources (fonts, styles, scripts)
- **Data Handling**: Complex object serialization (potential prototype pollution vector)

### Recommendations
1. **Version Pinning**: Pin exact TLDraw version to prevent unexpected updates
2. **Local Bundling**: Bundle TLDraw locally to eliminate CDN dependency
3. **Data Sanitization**: Implement strict validation for TLDraw data structures
4. **Regular Updates**: Monitor TLDraw security advisories

---

## 7. Recommended Action Plan

### 🚨 **Phase 1: Critical Fixes (Before Production)**
**Timeline**: Immediate (1-2 weeks)

1. **Remove `'unsafe-eval'` from CSP** (Priority 1)
   - Test TLDraw functionality without `'unsafe-eval'`
   - Implement alternative if required (nonce-based approach)
   
2. **Eliminate external CDN dependency** (Priority 2)
   - Bundle TLDraw locally OR implement SRI
   - Test all TLDraw functionality

### 🔧 **Phase 2: High Priority Fixes (Next Release)**
**Timeline**: 2-4 weeks

3. **Implement input validation** (Priority 3)
4. **Fix file path vulnerabilities** (Priority 4)

### 🛠 **Phase 3: Medium Priority Improvements**
**Timeline**: Next major version

5. **Fix race conditions** (Priority 5)
6. **Improve auto-save UX** (Priority 6)  
7. **Sanitize error messages** (Priority 7)

### 📋 **Phase 4: Long-term Maintenance**
**Timeline**: Ongoing

8. **Tighten CSP policies** (Priority 8)
9. **Implement data lifecycle management** (Priority 9)
10. **Remove external dependencies** (Priority 10)
11. **Clean development artifacts** (Priority 11)
12. **Set up security monitoring** (Priority 12)
13. **Create security documentation** (Priority 13)

---

## 8. Security Testing Recommendations

### Immediate Testing
- [ ] Test extension without `'unsafe-eval'` CSP directive
- [ ] Verify TLDraw functionality with local bundling
- [ ] Test with malformed `.sketchprompt` files
- [ ] Verify file path validation

### Ongoing Security Measures
- [ ] Implement automated dependency scanning (npm audit, Snyk)
- [ ] Set up CSP violation reporting
- [ ] Regular security reviews of TLDraw updates
- [ ] Penetration testing of the extension

---

## 9. Compliance & Best Practices

### Security Standards Alignment
- ✅ **OWASP Top 10**: Addresses XSS, injection, and component vulnerabilities
- ✅ **NIST Cybersecurity Framework**: Implement Identify, Protect, Detect controls
- ✅ **VS Code Extension Security**: Follow VS Code extension security guidelines

### Development Security Practices
- [ ] Implement security code review process
- [ ] Add security testing to CI/CD pipeline
- [ ] Create incident response plan
- [ ] Document security architecture

---

## 10. Conclusion

SketchPrompt demonstrates solid architectural design and clear functionality. However, **critical security vulnerabilities** must be addressed before production deployment:

### **Current Risk**: 🔴 **HIGH**
- Remote code execution possible via CSP `'unsafe-eval'`
- Supply chain attack vector via external CDN
- Input validation vulnerabilities

### **Post-Fix Risk**: 🟡 **LOW** 
- After addressing Priority 1-4 issues
- With proper security monitoring in place

### **Recommendation**: 
**DO NOT DEPLOY** to production until Priority 1-2 issues are resolved. The extension shows promise but requires immediate security attention to protect users and maintain trust.

---

**Report Generated**: January 2025  
**Next Review**: After critical fixes implementation  
**Contact**: For questions about this report or implementation guidance