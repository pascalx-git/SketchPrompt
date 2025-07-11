# Napkin‑to‑Canvas Upload — Feature Specification

## 1 · Problem Statement

Designers, PMs, and engineers often ideate on paper: whiteboards, notebooks, sticky notes, napkins. In Cursor they currently must:

1. Photograph the sketch on their phone.
2. AirDrop/email/Slack the file to their laptop.
3. Locate the file.
4. Copy‑paste into Cursor chat or the SketchPrompt canvas.

This 4‑step detour adds friction, breaks flow, and discourages using visual thinking as a prompt.

## 2 · Vision

**One‑tap capture → instant appearance in the SketchPrompt canvas inside Cursor.**
From there, users can annotate, refine, or paste into chat. The uploader also becomes the gateway to future AI auto‑captioning, tagging, and sketch history.

## 3 · Goals (v0.1)

* 🌟 **Fast**: ≤10 s from phone snap to canvas.
* 🌟 **Zero friction**: no file‑hunting on desktop.
* 🌟 **Cross‑platform**: works on iOS, Android, Windows, macOS.
* 🌟 **Extensible**: same pipeline can later feed AI services or Cursor chat when APIs allow.

## 4 · User Types

| Role                 | Need                                                      |
| -------------------- | --------------------------------------------------------- |
| **Solo dev**         | Drop napkin flow into Cursor, ask AI to scaffold code.    |
| **Product Designer** | Capture whiteboard UI wireframe, discuss with AI in chat. |
| **PM / Stakeholder** | Snap paper journey map; see it live in review call.       |

## 5 · Key Scenarios

1. **Paper wireframe → React scaffold**
   User sketches a mobile login screen, uploads, pastes into chat, AI returns JSX.
2. **Whiteboard flow → Architecture diagram**
   Team sketches system boxes, uploads, AI suggests infra code.
3. **Sticky‑note brainstorm**
   Sticky wall is photographed; AI clusters and summarizes notes.

## 6 · Feature Overview

| Aspect           | MVP                                   | Phase 2+                                                    |
| ---------------- | ------------------------------------- | ----------------------------------------------------------- |
| Upload app       | PWA with camera/file picker           | Native iOS/Android share‑sheet shortcut                     |
| Transfer         | REST upload → S3 → WebSocket notify   | Direct presigned POST, chunked, offline retry               |
| Canvas injection | As TLDraw **image shape** at (center) | Auto‑resize to fit viewport, initial tags                   |
| Clipboard helper | Manual (user copies)                  | Auto‑copy PNG + Markdown caption                            |
| AI hook          | None (user pastes manually)           | Auto‑caption + optional auto‑prompt to chat when API exists |

## 7 · Roadmap vs MVP

**MVP (4 weeks):**

1. Phone PWA uploader
2. S3/Cloud Storage + presigned URL
3. Node/Express relay with Socket.io
4. SketchPrompt extension WebSocket client
5. Canvas injection (image shape)
6. Manual copy‑to‑chat guide tooltip

**Phase 2 (2–3 mo):**

* Auto‑caption via OpenAI Vision
* Clipboard auto‑copy
* History panel of all uploaded sketches

**Phase 3 (future):**

* Cursor chat API hook → auto‑insert
* Image→vector simplification (SwiftSketch) + tag overlay
* Real‑time phone camera streaming

## 8 · Developer Implementation Plan (MVP)

### 8.1 Tech Stack

| Layer          | Tech                                         |
| -------------- | -------------------------------------------- |
| Phone uploader | Next.js PWA, Tailwind, fetch POST            |
| Storage        | AWS S3 (public‑read bucket)                  |
| Relay          | Express + Socket.io (Deployed on Render/Fly) |
| IDE extension  | VS Code API (works in Cursor)                |
| Canvas         | TLDraw React component (already embedded)    |

### 8.2 Data Flow

```
Camera  →  POST /upload  →  S3  →  Socket.io emit {url,w,h}
                                      ↘
                           SketchPrompt Webview (listener)
                                      ↘
                         editor.createShape({type:'image',url})
```

### 8.3 Endpoints

* **POST /upload**  – multipart/form‑data `file`  → returns `{ url, width, height }`
* **Socket message** `new-image`  – payload `{ url,width,height }`

### 8.4 Extension Listener (pseudocode)

```ts
socket.on('new-image', ({ url, width, height }) => {
  webview.postMessage({ type: 'ADD_IMAGE', url, width, height })
})
```

Webview side:

```js
window.addEventListener('message', e => {
  if (e.data.type === 'ADD_IMAGE') {
    editor.createShape({
      id: nanoid(), type: 'image', x: 0, y: 0,
      props: { w: e.data.width, h: e.data.height, url: e.data.url }
    })
  }
})
```

### 8.5 Security / Privacy

* Store images in **time‑limited path** (`/uploads/{session}/{uuid}.png`)
* Optional Signed URLs expiring after 7 days
* All traffic over HTTPS & WSS

### 8.6 Config

* `.env` in extension for `RELAY_URL`
* `.env` in PWA for `UPLOAD_URL`

### 8.7 Dev Timeline (1 dev)

| Week | Deliverable                                    |
| ---- | ---------------------------------------------- |
| 1    | PWA uploader + S3 upload test                  |
| 2    | Relay server + Socket broadcast                |
| 3    | Extension WebSocket listener + image injection |
| 4    | Polishing, onboarding tooltip, docs            |

## 9 · Open Questions

1. Do we need user auth or is upload bucket public‑write, public‑read? (MVP skip auth)
2. How to clean old uploads? Lambda deletion job after 30 days.
3. If Cursor releases chat‑insert API, when to trigger auto‑paste? (Phase 3)

## 10 · Success Metrics (MVP)

* **Time‑to‑canvas** ≤ 10 s for 90% uploads
* **Monthly active uploads** ≥ 30% of SketchPrompt users within 3 mo
* **Qualitative feedback**: sketch prompt perceived as “faster than emailing files”

---

*Spec drafted July 2025 · owner: <you>*
