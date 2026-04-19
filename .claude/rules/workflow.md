# Workflow rules

## Research → Plan → Implement → Verify
1. Read the files you'll touch and nearby files for patterns.
2. Say in one or two sentences what you'll change and why.
3. Make the smallest change that solves it.
4. Verify:
   - `npm run type-check` and `npm run build` pass
   - For any UI change, drive the browser via chrome-devtools MCP so the user can watch. Screenshots at desktop + 375px. See [.claude/rules/testing.md](./testing.md).

## Before committing
- `npm run type-check` passes
- `npm run lint` passes (or explain any warning left behind)
- `git diff` reviewed — no console.logs, no commented-out code, no secrets
- Commit style: `<type>(<scope>): <description>` — e.g. `fix(register): validate phone length`

## Documentation discipline
- Open `.claude/index.md` at the start of every task — it tells you which rule/doc to read.
- New `.md` files go in `docs/` (create subfolders as needed: `docs/architecture/`, `docs/runbooks/`, `docs/features/`).
- **Every time you add, rename, or delete a `.md` file, update `.claude/index.md` in the same commit.** An unlisted doc does not exist.
- Exceptions allowed at repo root: `README.md`, `CLAUDE.md`. Rule files stay in `.claude/rules/`.

## Do NOT
- Weaken a test assertion to make it pass. Fix the code instead.
- Add a dependency without asking.
- Touch files outside the current task's scope.
- Run `git push --force`, `git reset --hard`, or `rm -rf` without confirming with the user.
- Skip hooks (`--no-verify`). If a hook fails, fix the cause.

## When stuck (three-strike rule)
- 1st failure: fix the specific error.
- 2nd same-category failure: re-read the error fully, question the approach.
- 3rd: STOP. Summarize what was tried and propose 2–3 alternatives. Let the user pick.

## Netlify deploys
- Max 2 deploy attempts per fix. If it fails twice, stop and diagnose locally.
- `npm run build` must pass locally before any push to main.
