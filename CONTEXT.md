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

- Custom `prompt` shape (`src/PromptShape.tsx`) with a Run button.
- Prompt text is editable rich text (double-click or select + Enter).
- Run spawns 3 output rectangles (geo) and arrows bound from the prompt to
  each, simulating a model fan-out.
- Re-running is a no-op: guarded on existing arrow bindings involving the
  prompt.
- Verified: `npm run build` and browser test (edit text in place; Run creates
  3 rects + 3 bound arrows; second click does not duplicate).

## Next

- Editable prompt text, custom tool to add prompt shapes.
- Replace output rectangles with a custom artefact shape for HTML previews.
