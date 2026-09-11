# tldesign — progress context

## Goal

Infinite canvas design app on the tldraw SDK. A single input fans out to
different models; each model's output becomes input for the next step.

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

## Next

- Decide first real feature (input node -> model fan-out).
