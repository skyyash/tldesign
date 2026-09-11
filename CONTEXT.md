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
  title, an edit button and a copy button; interactive HTML preview in an
  iframe (`srcDoc`, `sandbox="allow-scripts"`). The edit button swaps the
  preview for a monospace textarea (Escape, the edit button, or a click outside
  the shape returns to preview); edits update the preview live. Editing is a
  local state toggle, not tldraw's double-click editing.
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

### 6. Settings store + API key input (2026-09-11)

- New `src/lib/settings.tsx`: `SettingsProvider` + `useSettings()`, persisted to
  localStorage (`tldesign.settings`) as `{apiKey, enabledModels}` with
  `setApiKey`, `toggleModel`, `setEnabledModels`. Plaintext key (TODO below).
- App wrapped in `SettingsProvider` so the navbar and the canvas share the store.
- `src/SettingsModal.tsx`: API key input wired to the store.
- Verified: `npm run build` and browser test (enter key, close/reopen, full
  reload -> persists; localStorage inspected).

### 7. Secure API key storage: session-only (2026-09-11)

- API key moved from localStorage to `sessionStorage` (`tldesign.apiKey`):
  survives reloads within the tab, cleared when the tab closes. `enabledModels`
  stays in localStorage (not a secret).
- Legacy localStorage `apiKey` migrated into the session once, then cleared
  from localStorage.
- Verified: `npm run build` and browser test (migration cleans localStorage;
  key survives reload in sessionStorage; clearing the key removes it).

### 8. Settings modal: catalog browser (2026-09-11)

- `src/SettingsModal.tsx`: API key input plus a model catalog browser.
- Catalog grouped by author, search box, badges for cost ($/M), context length,
  modality, and `:free`; enable toggles bound to `settings.enabledModels`
  (persist in localStorage).
- Models come from `getModelCatalog()` (cache/network/fallback) loaded on open,
  with a small source indicator.
- Verified: `npm run build` and browser test (439 models grouped by author;
  search filters; badges render; toggling persists across reload).

### 9. Prompt dropdown integration with settings (2026-09-11)

- Prompt dropdown (`src/PromptShape.tsx`) reads `settings.enabledModels` when an
  API key is set, resolving display names from the catalog. No key -> "Connect"
  state with an instruction; key but no enabled models -> hint to enable models.
- Play button disabled until a key exists and at least one model is selected.
  Fan-out uses display names for artefact headings and arrow labels (arrow
  label text uses the small size style). Selection (`props.models`) filters to
  currently enabled models.
- The model dropdown opens above the shape (outside its bounds), so the shape's
  hover/selection outline never renders on top of it.
- Verified: `npm run build` and browser test (no key -> Connect + instruction,
  play disabled; key + enabled -> dropdown lists enabled models, run creates
  labelled artefacts; key + no enabled -> hint; dropdown opens above the shape
  and stays clear of its outline).

### 10. chat/completions client (2026-09-11)

- `src/lib/openrouter.ts`: added `chatCompletion()` (POST
  `/api/v1/chat/completions`) with `Authorization: Bearer`, `Content-Type`, and
  the `HTTP-Referer`/`X-Title` headers; parses `choices[0].message.content`;
  throws on non-2xx.
- Verified: `npm run build` and browser probes (intercepted request shows
  correct method/headers/body; mock response parsed; real invalid key -> throws
  401). A real success path needs a valid key.

### 11. Wire play to real generation (2026-09-11)

- PromptShape `run` builds messages (a system prompt asking for self-contained
  HTML plus the prompt text), creates one artefact per selected model seeded
  with a "Generating..." placeholder, and calls `chatCompletion` per model.
  Each artefact fills with the model's HTML (markdown code fences stripped) or
  an error state.
- A run id guards stale completions; run re-reads the latest shape from the
  store so re-running replaces prior outputs (fixed a stale-closure bug found
  while testing).
- Verified: `npm run build` and browser test with a mocked
  `/chat/completions` (request body correct; artefact filled with output; error
  state renders; rapid re-run keeps only the latest result).

## Known issues

- Deleting a design removes it from the registry but leaves its IndexedDB
  document orphaned (cleanup TODO).
- Navbar profile button is a non-functional placeholder (no auth yet).

## Next

- Streaming responses into artefacts (currently fill on completion).
- Design-delete IndexedDB cleanup; profile/auth.
