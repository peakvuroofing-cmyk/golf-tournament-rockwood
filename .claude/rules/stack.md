# Stack-specific patterns

## Next.js 14 App Router
- Server Components by default. Add `'use client'` only when you need state, effects, or browser APIs.
- API routes live in `src/app/api/*/route.ts`. Export named HTTP handlers (`GET`, `POST`).
- Don't mix Pages Router (`pages/`) with App Router. This project is App Router only.

## Google Sheets (`src/lib/sheets/`)
- Use the existing client setup — don't re-initialize googleapis per call.
- Always batch writes when adding multiple rows.
- Dates are formatted as CST AM/PM (see recent commit `5215c55`). Keep that convention.
- If a sheet write fails, surface a user-facing message but log full error server-side only.

## Email (Nodemailer)
- Build emails from HTML string templates. Escape all user input before interpolation.
- Set `from`, `replyTo`, and a plain-text fallback on every email.
- Gmail SMTP throttles aggressively — don't send more than one email per form submission.

## Forms + validation
- Use `zod` schemas colocated with the route that consumes them.
- Client form submits to the API route; API route re-validates with the same schema. Never trust the client.

## TypeScript
- Strict mode is on. No `any` — use `unknown` and narrow.
- Run `npm run type-check` after edits.

## Tailwind
- Use existing utility patterns in `src/components/`. Don't introduce a new design system.
- Keep the recent UI refinements: flat gradients, gold hairlines, lucide icons (see recent commits).

## Dev server + browser verification for UI changes
- Run `npm run dev` in the background.
- Drive the real browser via chrome-devtools MCP (`mcp__chrome-devtools__*`) so the user can watch.
- Full checklist: see [.claude/rules/testing.md](./testing.md).
- Required: desktop + 375px mobile screenshots, clean console, clean network on happy path.
