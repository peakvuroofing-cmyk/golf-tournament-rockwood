# .claude/index.md — project orientation map

**Read this first on every task.** Pick the doc that matches what you're doing; don't read everything.

## Rule: updating this index
When you create, move, or delete any `.md` file, update this index in the same change. If you don't list it here, it doesn't exist.

## Rules (short, read the one that fits your task)
- [.claude/rules/security.md](./rules/security.md) — secrets, env, input validation, API routes
- [.claude/rules/workflow.md](./rules/workflow.md) — research→plan→implement→verify, three-strike rule, deploy limits
- [.claude/rules/stack.md](./rules/stack.md) — Next.js App Router, Google Sheets, Nodemailer, zod, Tailwind patterns
- [.claude/rules/testing.md](./rules/testing.md) — chrome-devtools MCP browser verification, required checks for UI

## Project docs (`docs/`)
All long-form docs live in `docs/`. Keep filenames kebab-case. Add new entries below when you create a file.

- _none yet — add entries here as docs are created_

### Where new docs go
- Architecture / design decisions → `docs/architecture/`
- Runbooks (deploy, incident, env setup) → `docs/runbooks/`
- Feature notes → `docs/features/`
- Create the subfolder if it doesn't exist; then add a link above.

## Project layout
```
.mcp.json              # MCP servers (chrome-devtools) — auto-loaded on project open
.claude/
├── index.md           # this file
├── settings.json      # shared permissions + sandbox (committed)
├── settings.local.json # personal overrides (gitignored)
└── rules/             # short rules, one per concern

docs/                  # all other project docs go here
src/
├── app/               # Next.js App Router (pages + api)
├── components/        # React components
├── lib/               # shared utilities
│   ├── sheets/        # Google Sheets read/write
│   └── config.ts      # event config from env
└── types/             # shared TS types
```

## Key flows to know
- `src/app/register/` — main registration form
- `src/app/api/` — form submission + email sending
- `src/lib/sheets/` — the data layer (Sheets is the DB)

## When in doubt
- Match patterns in neighboring files — don't invent new ones.
- Ask before adding dependencies, restructuring folders, or introducing a new service.
