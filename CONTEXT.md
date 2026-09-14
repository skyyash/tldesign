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
  HTML plus the prompt text), creates one artefact per selected model arranged
  in a circle around the prompt (evenly spaced angles, radius 420) seeded with
  a "Generating..." placeholder, and calls `chatCompletion` per model. Arrows
  radiate from the prompt to each artefact so they do not cross. Each artefact
  fills with the model's HTML (markdown code fences stripped) or an error
  state.
- A run id guards stale completions; run re-reads the latest shape from the
  store so re-running replaces prior outputs (fixed a stale-closure bug found
  while testing).
- Verified: `npm run build` and browser test with a mocked
  `/chat/completions` (request body correct; artefact filled with output; error
  state renders; rapid re-run keeps only the latest result).

### 12. Resizable custom shapes + prompt text clipping (2026-09-11)

- `prompt` and `artefact` utils now extend `BaseBoxShapeUtil` (inherits the
  `resizeBox` `onResize`), so both resize via the standard selection handles.
- The prompt text area clips overflow, so long text wraps and stays inside the
  shape.
- The artefact preview is interactive only while the shape is selected: the
  first click on its body selects it, then the iframe receives pointer events.
  Resize handles appear once selected.
- Verified: `npm run build` and browser test (long prompt text stays within the
  shape bounds; artefact body-click selects and makes the iframe interactive;
  resize goes through the standard box resize path).

### 13. Connection knobs on custom shapes (2026-09-11)

- New `src/lib/Knob.tsx`: an always-visible edge knob rendered in each custom
  shape's component. Dragging a knob creates an arrow bound at its start to the
  shape; the end follows the pointer and binds on drop to the shape under it
  (arrows and the source are skipped as targets). No selection required.
- `prompt` and `artefact` components render four knobs (one per edge).
- Verified: `npm run build` and browser test via the editor input pipeline
  (knobs always visible; knob drag connects prompt<->artefact in both
  directions).

### 14. Multi-provider clients (2026-09-11)

- New `src/lib/providers/`: a `Provider` interface plus clients for OpenAI,
  Google Gemini, Groq, and Anthropic (OpenRouter wrapped as a provider too).
  Registry in `index.ts` with composite `provider:id` model keys and
  `chatCompletionForProvider` routing.
- Gemini uses `generateContent` (contents/systemInstruction), Anthropic uses
  `/messages` (x-api-key, anthropic-version, system). OpenAI/Groq/OpenRouter are
  OpenAI-compatible chat completions.
- GitHub Models was dropped (retired by GitHub in July 2026).
- Verified: `npm run build` and browser probes (request shapes, auth headers,
  and message formats captured for all providers).

### 15. Multi-provider settings + simplified model enabling (2026-09-11)

- Settings store now holds `apiKeys: Record<ProviderId, string>` (session-only);
  a legacy OpenRouter key migrates into the `openrouter` slot.
- Settings modal is now per-provider API key inputs (OpenAI, Gemini, Groq,
  Anthropic, OpenRouter). A provider with a key is enabled; the per-model
  catalog browser was removed.
- Model catalog aggregates enabled providers' models (live fetch with the key,
  static fallback per provider); models carry `provider` and use `provider:id`
  composite keys.
- Prompt dropdown lists models grouped by provider; run routes each selected
  model to its provider's client via `chatCompletionForProvider`.
- Verified: `npm run build` and browser test with a mocked network (per-provider
  keys persist; dropdown groups OpenAI + Gemini models; running
  gpt-4o/gpt-4o-mini/gemini-2.0-flash filled artefacts with each provider's
  output).

### 16. Output-as-input chaining (2026-09-11)

- When a prompt has incoming arrows from artefacts (drawn via the knobs), its
  run now includes those artefacts' HTML content as context in the user message,
  so a model's output can feed the next prompt.
- The prompt navbar shows a connected-input chip (`⇢ n`).
- Verified: `npm run build` and browser test (artefact chained into a second
  prompt via an incoming arrow; the second prompt's request body included the
  artefact's content as context; chip rendered).

### 17. Streaming generation with retry and concurrency limits (2026-09-13)

- New provider `chatCompletionStream()` methods: OpenAI/Groq/OpenRouter share an
  SSE parser, while Gemini uses `streamGenerateContent` and Anthropic filters
  `content_block_delta` text events.
- Prompt runs now stream accumulated output into artefacts every 500 ms, run at
  most two models concurrently, and retry retryable failures twice with
  exponential backoff. Requests time out after 90 seconds.
- Verified: `npm run build` and browser probes (SSE deltas accumulate, max
  concurrency stays at two, a 429 is retried and then succeeds, and mocked
  Gemini/Anthropic/OpenRouter streams parse correctly).

### 18. Knob drag affordances and target feedback (2026-09-13)

- Always-visible connection knobs now show hover and active scale/ring states
  and a “drag to create a connection” tooltip.
- While dragging, the editor highlights the eligible drop target; the highlight
  clears on release or cancel without changing the arrow-binding rules.
- Verified: `npm run build` and a clean-design browser drag from an unselected
  prompt knob to an artefact. IndexedDB showed matching start and end bindings.

### 19. Design-delete IndexedDB cleanup (2026-09-13)

- Deleting a design now removes both its current and legacy per-design IndexedDB
  document, then removes the registry entry.
- Verified: `npm run build` and a browser test where the design-specific
  database appeared after opening the design and disappeared after deletion.

### 20. Built-in showcase example (2026-09-13)

- A `Showcase` button on the Designs home creates a local example design that
  seeds two prompts, two prefilled HTML artefacts, labeled fan-out arrows, and a
  chained second prompt (arrows from the artefacts into it). Static content, no
  API calls.
- Seeding is guarded by the `showcase` design flag and skips when the document
  already contains prompts, so reopening never duplicates.
- Verified: `npm run build` and a browser test (Showcase click opens the seeded
  demo; the second prompt shows the `⇢ 2` input chip; reopen preserves the same
  shape counts).

## Known issues

- Navbar profile button is a non-functional placeholder (no auth yet).

## Next

- Profile/auth.
