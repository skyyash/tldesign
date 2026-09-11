# tldesign — progress context

## Goal

Infinite canvas design app on the tldraw SDK. A single input fans out to
different LLM models; each model's output becomes input for the next step.

## How to run

```
npm install
npm run dev
```

Build check: `npm run build`

## Increments

### 1. Scaffold (2026-09-11)

- tldraw Vite + React + TypeScript shell (basic template).
- Trimmed tldraw-specific metadata; app named `tldesign`.
- Verified: `npm run build`.

### 2. Prompt shape with run button (2026-09-11)

- Custom `prompt` shape (`src/PromptShape.tsx`) with a fixed navbar: "Prompt"
  title, a multi-select model dropdown, and a play SVG button on the right.
- Prompt text is editable rich text (double-click or select + Enter).
- Play spawns one output artefact (HTML preview) per selected model, with
  arrows bound from the prompt to each (each arrow labeled with the model
  name), simulating a model fan-out. Re-running replaces the previous outputs
  (tracked via shape meta).
- Verified: `npm run build` and browser test (edit text in place; select models
  in the dropdown; play creates matching artefacts + bound arrows; re-run
  replaces them).

### 3. HTML artefact shape + custom toolbar tools (2026-09-11)

- New `artefact` shape (`src/ArtefactShape.tsx`): fixed navbar with "Artefact"
  title and a copy button, HTML preview in an iframe (`srcDoc`,
  `sandbox="allow-scripts"`). Double-click (or select + Enter) to edit the code
  in a monospace textarea; edits update the preview live.
- Custom tools (`src/tools.ts`): `prompt` and `artefact` place a shape centered
  on click, then return to select.
- Both tools added to the main toolbar: custom `Toolbar` component inserts
  them near the front; tool entries wired via `TLUiOverrides.tools` with
  built-in icons (`comment`, `code`).
- Verified: `npm run build` and browser test (place artefact via toolbar tool,
  edit code, preview updates; prompt tool places prompts; toolbar shows both).

### 4. App shell: Designs home + sticky navbar (2026-09-11)

- New `src/lib/designs.ts`: localStorage design registry (`{id, name, updatedAt}`)
  with create/list/rename/touch/delete.
- New `src/DesignsHome.tsx`: designs list with new/open, inline rename, delete
  (with confirm).
- New `src/AppNavbar.tsx`: sticky top bar, back "Designs" button, design name,
  profile placeholder + settings buttons.
- New `src/SettingsModal.tsx`: stub dialog (OpenRouter settings land later).
- `src/App.tsx`: home/editor routing; each design persists via tldraw
  `persistenceKey={id}` (IndexedDB).
- Removed the on-mount prompt auto-create; the Prompt tool places prompts now.
- Verified: `npm run build` and browser test (create/open/rename/delete; canvas
  persists across reopen and full reload; navbar + settings modal).

### 5. OpenRouter client + model catalog (2026-09-11)

- New `src/lib/openrouter.ts`: base URL, `OpenRouterModel` type, `fetchModels()`
  with `HTTP-Referer` (window origin) and `X-Title: tldesign` headers.
- New `src/lib/modelCatalog.ts`: `getModelCatalog()` with a 24h localStorage
  cache (fresh -> cache; else fetch -> network + cache write; stale cache if
  the network fails; else static `FALLBACK_MODELS`). Helpers: `authorOf`,
  `isFreeModel`, `promptPricePerMillion`, `formatContextLength`, `displayName`.
- Verified: `npm run build` and browser probes (network fetch returned 439
  models; second call served from cache; offline -> static fallback list; stale
  cache served offline; headers captured on the request).

## Known issues

- OpenRouter API key will be stored in plaintext in localStorage (accepted for
  now). MUST move to secure storage in the immediate next increment after the
  settings store lands. Candidate approaches: session-only (in-memory /
  sessionStorage) or passphrase-encrypted localStorage via WebCrypto.
- Deleting a design removes it from the registry but leaves its IndexedDB
  document orphaned (cleanup TODO).
- Navbar profile button is a non-functional placeholder (no auth yet).

## Next

- Settings store (apiKey, enabledModels ids) in localStorage, plaintext key
  (TODO above). Then secure key storage.
- Settings modal content: API key input + catalog browser grouped by author,
  search, cost/context/modality badges, `:free` flags, enable toggles.
- Prompt dropdown integration (reads enabled models; connect instruction when
  no key).
