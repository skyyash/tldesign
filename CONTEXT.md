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
  title on the left, play SVG button on the right.
- Prompt text is editable rich text (double-click or select + Enter).
- Play spawns 3 output rectangles (geo) and arrows bound from the prompt to
  each, simulating a model fan-out.
- Re-running is a no-op: guarded on existing arrow bindings involving the
  prompt.
- Verified: `npm run build` and browser test (edit text in place; play creates
  3 rects + 3 bound arrows; second click does not duplicate).

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

## Next

- Fan-out should produce artefact shapes (HTML previews) instead of plain
  rectangles, so each model output becomes an editable artefact.
