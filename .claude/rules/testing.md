# Testing & browser verification rules

## First-time setup (per machine)
This repo ships a project-level MCP config at `.mcp.json` that declares the `chrome-devtools` MCP server. Claude Code auto-detects it when you open the project.

**What happens on first use on a new computer:**
1. Claude Code sees `.mcp.json` and prompts: *"Trust MCP servers from this project?"* — approve it.
2. The server is launched via `npx -y chrome-devtools-mcp@latest`, which downloads and caches the package automatically. No manual install needed.
3. Chrome must be installed on the machine. If it isn't: download from https://www.google.com/chrome/ before running tests.
4. Verify it loaded by listing available tools — you should see `mcp__chrome-devtools__*` entries.

If the prompt didn't appear, run `claude mcp list` in the project root. If `chrome-devtools` isn't there, run `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest` to add it.

## Use chrome-devtools MCP for every UI change
Claude must drive the real browser through the `mcp__chrome-devtools__*` tools so the user can watch verification happen live. Do not claim a UI task is done based on typecheck alone.

### Standard flow
1. Start the dev server in the background: `npm run dev` (default http://localhost:3000).
2. Open a page with `mcp__chrome-devtools__new_page` (or reuse via `list_pages` + `select_page`).
3. Navigate with `mcp__chrome-devtools__navigate_page` to the changed route.
4. Exercise the feature — use `click`, `fill`, `fill_form`, `hover`, `press_key`, `type_text`.
5. Verify with `take_screenshot` AND `take_snapshot` (DOM a11y tree). Attach screenshots in your report.
6. Check `list_console_messages` and `list_network_requests` for errors / failed API calls.
7. For the registration flow, test at **375px mobile width** using `resize_page` (per recent UI commit).

### Required checks for every UI task
- [ ] Screenshot at desktop (1280px) and mobile (375px)
- [ ] Console has no red errors
- [ ] Network tab: no 4xx/5xx on the happy path
- [ ] Golden-path interaction works end-to-end (fill form → submit → see confirmation)
- [ ] At least one edge case exercised (empty field, invalid email, etc.)

### When NOT to use chrome-devtools
- Pure backend / API route changes with no UI surface — unit-test the route logic instead.
- Type-only or refactor commits with no behavior change.

## Never weaken a test to make it pass
If assertions fail, fix the implementation. Don't edit the assertion.

## Performance / a11y spot checks
For bigger UI work, run `mcp__chrome-devtools__lighthouse_audit` and attach the summary. Fail the task if accessibility score drops below the previous baseline.
