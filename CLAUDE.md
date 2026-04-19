# Golf Tournament Registration — Rockwood

Next.js 14 registration site for a charity golf tournament. Writes signups to Google Sheets and sends confirmation emails.

## First-time setup on a new computer
1. `npm install`
2. Copy `.env.example` → `.env.local` and fill in the secrets.
3. Open the project in Claude Code — it will prompt to trust `.mcp.json` (approve it). This wires up the chrome-devtools MCP server used for UI test verification. See `.claude/rules/testing.md` if anything fails.
4. `npm run dev` to confirm the site boots.

## Stack
- Next.js 14 App Router · TypeScript (strict) · Tailwind
- Google Sheets API (`googleapis`) — primary data store
- Nodemailer + Gmail (App Password) — confirmation emails
- Netlify — hosting

## Commands
- `npm run dev` — local dev
- `npm run type-check` — `tsc --noEmit` (run before any deploy)
- `npm run build` — production build
- `npm run lint` — eslint

## Start here
**Always open `.claude/index.md` first.** It maps every rule and doc in this project and tells you which one to read for the task at hand. Do not skip it.

## Documentation rule
- All project `.md` files (design notes, decisions, runbooks, API notes) live in `docs/`.
- Never create loose `.md` files in the repo root or inside `src/`.
- **When you create or rename any `.md` file, update `.claude/index.md` in the same change** so the map stays accurate.
- Exceptions: `README.md` (root), `CLAUDE.md` (root), and files inside `.claude/rules/`.

## What this project is NOT (yet)
- No Supabase, no Stripe, no database. Don't add them without asking.
- Payments are handled outside this app (check referenced in form, tracked in sheet).

## Before declaring a task done
1. `npm run type-check` passes
2. `npm run build` passes
3. For any UI change: drive the browser via chrome-devtools MCP (`mcp__chrome-devtools__*`) so the user can watch. Screenshots at desktop + 375px mobile, clean console, clean network. See `.claude/rules/testing.md`.
