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

### 21. Fix Gemini API integration (2026-09-14)

- Gemini `streamGenerateContent` returns newline-delimited JSON, not SSE, so the
  SSE parser dropped every delta and runs ended in "no output". Added `alt=sse`
  to the streaming URL.
- Gemini fallback model list updated from retired models
  (gemini-2.0-flash / 2.5-flash / 2.5-pro) to available ones (gemini-3.6-flash,
  gemini-3.8-flash, gemini-flash-latest, gemini-pro-latest).
- Verified with a live Gemini key: the model list fetches and a real prompt
  streams generated HTML into an artefact.

### 22. Restored catalog browser + prompt dropdown search (2026-09-14)

- The settings modal restored a model catalog browser: models from enabled
  providers grouped by provider, with a search box, in a fixed-height scrollable
  list (read-only reference).
- The prompt's model dropdown now has a search bar and a fixed-height scrollable
  list instead of an unbounded list.
- Verified: `npm run build` and browser test (both searches filter models; the
  dropdown list scrolls at a fixed height; the settings catalog groups by
  provider).

### 23. Model enabling from catalog + dropdown scroll fix (2026-09-14)

- Settings store re-added `enabledModels` (localStorage); the catalog browser
  now has per-model enable toggles.
- The prompt dropdown lists only enabled models.
- Fixed dropdown scroll: wheel events over the dropdown list and settings
  catalog stop propagation, so tldraw's canvas no longer hijacks them.
- Verified: `npm run build` and browser test (catalog toggles persist; the
  dropdown shows only enabled models; the list overflows at a fixed 240px and
  scrolls).

### 24. Showcase becomes a project + richer demo (2026-09-14)

- The Showcase button is gone from the Designs home. The demo design is now a
  normal project: it auto-seeds once on first run as "Pulse landing page" and
  shows in the designs list like any design.
- The demo is more involved: a source prompt fans out to three model-labelled
  artefacts (GPT-4o, Gemini, Groq) with three visually distinct seeded HTML
  landing pages, all three chain into a synthesis prompt (`⇢ 3` input chip),
  which produces a final refined artefact (labelled Synthesize). Prompts are
  preconfigured with model selections so a live re-run works once keys are
  pasted and models enabled.
- Verified: `npm run build` and browser test from a wiped localStorage
  (button gone; project auto-created; 2 prompts, 4 artefacts, 7 labelled
  arrows, chain chip; all iframes carry seeded HTML).

### 25. Three-stage showcase + in-place re-run (2026-09-14)

- The showcase is now a full 3-stage pipeline on a coffee-subscription brief
  ("Ember"): stage 1 fans one prompt out to four models (2 Gemini + 2 Groq),
  stage 2 synthesizes the four outputs into one refined hero, stage 3 reuses
  that design system to build a pricing section. Text shapes label the stages;
  prefilled artefacts are polished so the canvas reads as a finished demo.
- Seeded model IDs and `FALLBACK_MODELS` updated to live models (Gemini
  3.6/3.8 Flash, Groq GPT-OSS 120B / Qwen 3.8 27B, etc.). The previous seed
  referenced a retired Groq model.
- Re-running a prompt now updates its existing arrow-bound artefacts in place
  (same shapes, same arrows, same layout) when the output count matches the
  selection, instead of spawning duplicates. Fresh prompts are unchanged.
- Fixed a streaming race: the trailing flush could overwrite a finalized
  artefact with the raw stream (leaving markdown code fences). Final writes now
  clear the pending buffer.
- Verified: `npm run build` and a live browser run with Gemini + Groq keys
  (OpenRouter key returns 402, no credit, so it is not seeded). All three
  stages regenerated in place with shape counts unchanged (3 prompts, 6
  artefacts, 11 arrows); outputs clean, no fences. `gemini-3.6-flash` returned
  transient 503s across two runs (handled by retry, then the error card).

### 26. Bake browser canvas edits into the showcase seed (2026-09-14)

- The showcase canvas was rearranged by hand in the browser (new "final better
  one" prompt fed by two heroes, old synthesis output removed, title deleted,
  artefacts resized ~4x). `showcaseSeed.ts` was regenerated from the saved
  IndexedDB document so the seed reproduces the edited canvas exactly:
  positions, sizes, prompt models, artefact HTML, arrow geometry and all 22
  bindings.
- Verified: `npm run build` and a wipe-and-reseed browser run; a normalized
  shape/binding diff against the original document shows 0 differences across
  22 shapes and 22 bindings.
- The seed now opens zoomed to fit the (sprawling) layout rather than a fixed
  camera, so it renders on any viewport.

## Known issues

- Navbar profile button is a non-functional placeholder (no auth yet).
- Provider 5xx are transient and surface as an artefact error card after the
  two retries (observed: Gemini 503 on `gemini-3.6-flash`).

## Next

- Profile/auth.
