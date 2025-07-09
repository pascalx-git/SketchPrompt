# SketchPrompt: Vision, Concept, and Requirements (Cursor Edition)

## 🔭 Vision

SketchPrompt is a **Cursor-native extension** that enables visual thinkers to sketch ideas, concepts, and UI flows directly inside the AI-first coding workflow. Built on TLDraw, SketchPrompt fills the critical gap for designers, product builders, and hybrid developers who rely on visuals to think, communicate, and build.

> TLDraw already offers a robust VS Code extension. SketchPrompt is explicitly for Cursor — which currently lacks any sketching or multimodal thinking tools.

This extension turns Cursor into a **multi-modal prompt engine**: a space where visuals are first-class citizens in the design-code-feedback loop.

---

## 🧠 Problem

* Cursor is powerful for AI prompting and code generation — but only via text.
* Designers and visual builders need to sketch UI or logic before writing prompts.
* Switching between Cursor ↔ Figma or paper breaks the flow.
* No extension currently enables sketching within Cursor.

---

## 💡 Concept

SketchPrompt embeds a TLDraw-powered canvas into Cursor's UI. It allows users to sketch in a sidebar or panel, export the sketch, and inject it into prompt inputs or markdown directly.

**SketchPrompt = Sketch → Prompt → Output.**

Key workflows:

* Sketch a UI idea
* Hit “Copy to Prompt”
* TLDraw image + prompt description is injected into the AI thread

---

## ✅ MVP Requirements

### Functional

1. **Cursor-Compatible Extension** (WebviewViewProvider)
2. **TLDraw Embedded Canvas** (React app in Webview)
3. **Open from Command Palette** (e.g. `SketchPrompt: Open Canvas`)
4. **Sketch Export** (as `.png`, `.svg`, `.json`)
5. **Copy to Prompt** (injects sketch reference/image into current prompt input)
6. **Sidebar + Full Panel Toggle**
7. **Light/Dark Theme Adaptation**

### Non-Functional

* Fully offline/local-capable
* Instant canvas load (under 1s perceived load time)
* Zero-dependency onboarding: no external auth, setup, or cloud

---

## 🧭 Roadmap (Post-MVP)

* [ ] AI-assisted prompt generation based on sketch content
* [ ] Timeline/history of past sketches
* [ ] Git sync or export to README
* [ ] Live annotation/feedback mode (e.g. comment layer)
* [ ] Collaborator/duo sketch sharing (via temporary links or cloud layer)

---

## 👥 Who This Is For

* UX/product designers working inside Cursor
* Prompt engineers using diagrams or flows
* Developer/design hybrids
* Anyone who thinks with visuals, not just words

---

## 💰 Monetization Strategy

* **Free** for core sketch → prompt loop
* Premium unlocks:

  * Multi-canvas support
  * Sketch history / version control
  * AI-generated captions + prompt text from sketches
  * Sync to GitHub or online backups
* Pricing: one-time (\$5) or \$1/mo

---

## 🌍 Why Cursor?

Cursor is a modern, AI-native IDE. It is already redefining how engineers work with code and AI. But it is still **code- and text-first**.

SketchPrompt adds the missing layer: **visual context as part of the AI prompt loop**.

Cursor doesn’t just need better prompting tools. It needs better **thinking tools**.

SketchPrompt is step one.
