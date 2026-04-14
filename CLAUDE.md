# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
```

No test runner is configured.

## Architecture

**QuantAI** is a Next.js 16 (App Router) frontend for a Databricks MLflow Responses Agent. It is a pure UI shell — all agent logic lives behind a single integration point.

### Integration point

`src/lib/backend.ts` — `callQuantAIBackend(prompt)` is the **only** function that talks to the backend. It currently returns mock data. Replace it with your Databricks MLflow Responses Agent call when the endpoint is ready. The `ToolCall` type it exports is used throughout the UI.

### Page & state

`src/app/page.tsx` is the only route. It holds all app state (`sessions`, `selectedSessionId`, `isThinking`, `toolCalls`, `responseMessage`) and passes them down as props. There is no global state library.

Two views render inside the main area:
- **HomeView** — shown when no session is selected; renders `ChatInput` + `MetricCards` over a decorative dot-pattern background.
- **SessionDetail** — shown when a session is selected; renders `ThinkingPanel` (streamed tool calls + final message) with a right-side metadata panel, and a `ChatInput` footer.

### Component map

| Component | Role |
|-----------|------|
| `Sidebar` | Session list with search; splits sessions into active/inactive groups |
| `SessionDetail` | Selected-session view: header, `ThinkingPanel`, metadata aside, chat footer |
| `ThinkingPanel` | Renders tool calls (collapsible `ToolCallRow`) and the final assistant message |
| `ChatInput` | Shared prompt input used on both the home and session views |
| `MetricCards` | Decorative metric tiles on the home view |
| `AddSkillModal` | Modal for adding skills (UI only, not yet wired) |

### Styling

Tailwind CSS v4 via PostCSS. No component library — all styling is inline Tailwind classes. Custom dot-pattern and dot-cluster CSS is in `src/app/globals.css`. Fonts: Geist Sans + Geist Mono (via `next/font/google`).

### Key types

```ts
// src/lib/types.ts
Session { id, title, subtitle, age, active }

// src/lib/backend.ts
ToolCall { id, toolName, input, output, durationMs }
```
