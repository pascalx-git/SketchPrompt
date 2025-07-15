# SketchPrompt Localization Feature Specification

## Executive Summary

This document outlines the localization strategy for SketchPrompt, a VSCode extension that provides visual sketching capabilities for AI prompting. The goal is to make SketchPrompt accessible to international users by implementing comprehensive internationalization (i18n) support.

## Current State Assessment

### Architecture Overview
- **Extension Host**: TypeScript-based VSCode extension handling commands, file operations, and webview management
- **Webview**: React application with TLDraw integration for the main sketching interface
- **Build System**: Vite for webview bundling, TypeScript compilation for extension

### Current Localization Status
- ❌ **No i18n infrastructure** - No translation system in place
- ❌ **Hardcoded strings** - All UI text is hardcoded in English
- ❌ **No language detection** - No mechanism to detect user's preferred language
- ✅ **TLDraw has excellent i18n support** - The core sketching engine already supports 20+ languages

## Localization Opportunities Assessment

### 1. **TLDraw Canvas Localization** 🎯 **HIGH PRIORITY - LOW HANGING FRUIT**
**Opportunity**: TLDraw already has comprehensive internationalization support with full translations in Chinese, French, German, Spanish, Hindi, Arabic, and partial translations in 20+ other languages.

**Current TLDraw Supported Languages**:
- **Full translations**: Chinese (Simplified), French, German, Spanish, Hindi, Arabic
- **Partial translations**: Danish, Farsi, Italian, Japanese, Korean, Portuguese, Russian, Swedish, Turkish, Ukrainian, and more

**Solution**: 
- Implement language selection mechanism
- Pass user's preferred language to TLDraw configuration
- Enable automatic language detection from VSCode locale

**Impact**: 🔥 **IMMEDIATE HIGH IMPACT** - Localizes the core sketching experience for majority of users

### 2. **VSCode Extension Commands & Menus** 🎯 **HIGH PRIORITY**
**Opportunity**: VSCode has built-in i18n support through `vscode-nls` package.

**Elements to Localize**:
- Command titles ("SketchPrompt: New Sketch", "SketchPrompt: Help")
- Menu items in explorer context menu
- Extension description and display name
- Custom editor display name

**Solution**:
- Implement `vscode-nls` for extension strings
- Create language resource files
- Update package.json with localized strings

**Impact**: 🔥 **HIGH IMPACT** - Localizes the VSCode integration experience

### 3. **Webview UI Elements** 🎯 **MEDIUM PRIORITY**
**Opportunity**: Currently minimal custom UI, but will grow with future features.

**Elements to Localize**:
- Error messages and notifications
- Loading states
- Future UI enhancements

**Solution**:
- Implement React i18n library (react-i18next)
- Create translation key system
- Integrate with VSCode locale detection

**Impact**: 🔶 **MEDIUM IMPACT** - Important for user experience consistency

### 4. **File Type & Format Localization** 🎯 **LOW PRIORITY**
**Opportunity**: .sketchprompt file format and related metadata.

**Elements to Localize**:
- File type descriptions
- Language configuration for syntax highlighting
- Help documentation

**Solution**:
- Localize language configuration
- Create localized help files
- Update file associations

**Impact**: 🔷 **LOW IMPACT** - Nice to have for completeness

## Priority Implementation Plan

### Phase 1: Core Canvas Localization (Week 1-2) 🎯 **IMMEDIATE**
**Goal**: Enable TLDraw's built-in localization support

**Tasks**:
1. Add language selection to webview configuration
2. Implement VSCode locale detection
3. Pass language preference to TLDraw
4. Add language persistence in extension settings
5. Test with major languages (Chinese, French, German, Spanish)

**Expected Languages**: 6 full + 20 partial = 26 languages ready immediately

### Phase 2: VSCode Integration Localization (Week 3-4) 🎯 **HIGH PRIORITY**
**Goal**: Localize all VSCode extension elements

**Tasks**:
1. Install and configure `vscode-nls`
2. Extract all hardcoded strings to resource files
3. Create translation files for major languages
4. Update package.json with localized metadata
5. Test command palette and menu localization

**Expected Languages**: Start with 5-8 major languages (English, Spanish, French, German, Chinese, Japanese, Portuguese, Russian)

### Phase 3: Webview UI Localization (Week 5-6) 🎯 **MEDIUM PRIORITY**
**Goal**: Prepare infrastructure for future UI expansion

**Tasks**:
1. Install and configure react-i18next
2. Create translation key system
3. Implement language switching mechanism
4. Localize existing error messages and notifications
5. Create documentation for adding new strings

**Expected Languages**: Align with Phase 2 languages

### Phase 4: Documentation & Polish (Week 7-8) 🎯 **LOW PRIORITY**
**Goal**: Complete localization experience

**Tasks**:
1. Localize help documentation
2. Create language-specific README files
3. Add localized file type descriptions
4. Implement community translation guidelines
5. Performance optimization and testing

## Technical Implementation Details

### TLDraw Language Integration
```typescript
// In sketching-app.tsx
const userLanguage = getUserLanguage(); // From VSCode API
<Tldraw 
  locale={userLanguage}
  onMount={handleMount} 
/>
```

### VSCode Extension Localization
```typescript
// Using vscode-nls
import * as nls from 'vscode-nls';
const localize = nls.config(process.env.VSCODE_NLS_CONFIG)();

// In package.json
"contributes": {
  "commands": [
    {
      "command": "sketchprompt.newSketch",
      "title": "%sketchprompt.newSketch.title%"
    }
  ]
}
```

### React i18n Setup
```typescript
// i18n configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      // ... other languages
    },
    lng: getUserLanguage(),
    fallbackLng: 'en'
  });
```

## Language Priority Matrix

### Tier 1 (Immediate Priority)
- **English** (en-US) - Default/source language
- **Spanish** (es-ES) - Large global user base
- **French** (fr-FR) - Strong developer community
- **German** (de-DE) - Strong developer community
- **Chinese Simplified** (zh-CN) - Massive user base

### Tier 2 (Medium Priority)
- **Japanese** (ja-JP) - Strong tech community
- **Portuguese** (pt-BR) - Large developer community
- **Russian** (ru-RU) - Significant user base
- **Korean** (ko-KR) - Growing developer community

### Tier 3 (Future Expansion)
- **Italian** (it-IT)
- **Dutch** (nl-NL)
- **Arabic** (ar-SA)
- **Hindi** (hi-IN)

## Success Metrics

### Quantitative Metrics
- **Language Coverage**: Target 26 languages (leveraging TLDraw's existing translations)
- **User Adoption**: 30% increase in non-English speaking regions
- **Translation Completeness**: 95% for Tier 1, 80% for Tier 2
- **Performance Impact**: <5% bundle size increase

### Qualitative Metrics
- **User Experience**: Consistent localized experience across all touchpoints
- **Developer Experience**: Easy to add new translations
- **Community Engagement**: Community-driven translation contributions
- **Accessibility**: Improved accessibility for global users

## Development Notes

### Technical Considerations
- **Bundle Size**: Use tree-shaking to include only needed translations
- **Performance**: Lazy load translation resources
- **Fallback Strategy**: Graceful fallback to English for missing translations
- **Testing**: Automated tests for translation loading and switching

### Integration Points
- **VSCode Locale Detection**: Use `vscode.env.language` API
- **TLDraw Configuration**: Pass locale to TLDraw component
- **Settings Persistence**: Store language preference in extension settings
- **Theme Integration**: Ensure RTL support for Arabic/Hebrew

### Future Expansion
- **Community Contributions**: GitHub-based translation workflow
- **Translation Management**: Consider translation management service
- **Contextual Help**: Localized help content and tutorials
- **Cultural Adaptation**: Region-specific features and content

## Risk Assessment

### Technical Risks
- **Bundle Size Growth**: Mitigated by lazy loading and tree-shaking
- **Performance Impact**: Mitigated by efficient translation caching
- **Maintenance Overhead**: Mitigated by leveraging TLDraw's existing translations

### Process Risks
- **Translation Quality**: Mitigated by community review process
- **Consistency**: Mitigated by standardized translation keys
- **Updates**: Mitigated by automated translation update workflows

## Conclusion

SketchPrompt has excellent localization potential with TLDraw's existing multi-language support providing immediate value. The phased approach focuses on high-impact, low-effort improvements first, leveraging existing infrastructure where possible.

**Key Success Factors**:
1. **Leverage TLDraw's existing translations** for immediate impact
2. **Follow VSCode's established i18n patterns** for consistency
3. **Implement proper fallback mechanisms** for reliability
4. **Design for community contributions** for scalability

The implementation should begin with Phase 1 (TLDraw localization) as it provides immediate value with minimal development effort, followed by systematic expansion of localization coverage.