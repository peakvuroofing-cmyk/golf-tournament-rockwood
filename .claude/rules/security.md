# Security rules

## Secrets — never commit
- `.env`, `.env.local`, `.env.*.local` stay gitignored. Verify before any commit.
- Never paste real values of `GOOGLE_PRIVATE_KEY`, `EMAIL_PASS`, or `GOOGLE_SERVICE_ACCOUNT_EMAIL` into code, comments, commit messages, or chat logs.
- If a secret leaks into a commit: rotate it immediately, then rewrite history. Do not just delete the line in a new commit.
- `.env.example` is the only env file that gets committed. Keep it placeholder-only.

## Input handling (registration form)
- Validate every form field on the server with `zod` before writing to Sheets or sending email. Never trust client validation alone.
- Normalize and length-cap strings before passing to Nodemailer — prevents header injection via `\r\n` in name/email fields.
- Escape user-supplied content in email HTML bodies. No raw template interpolation.
- Reject emails that don't match a strict regex. Reject phone numbers over 20 chars.

## API routes
- Every `src/app/api/*` route must:
  - Check `request.method` (App Router: export named handlers only)
  - Parse + validate body with zod, return 400 on failure
  - Catch errors and return generic `{ error: "..." }` — never leak stack traces or env values
- No API route should read files outside `src/` or run shell commands.

## Google Sheets
- Service account has write access only to the one configured spreadsheet. Do not grant broader scopes.
- Never log the full service account JSON or private key, even in error paths.

## Dependencies
- Before adding any npm package: check if an existing dep covers the need. Ask the user before adding.
- Never install packages with known CVEs. Run `npm audit` after any install.

## Client-exposed env
- Only `NEXT_PUBLIC_*` vars reach the browser. Never prefix a secret with `NEXT_PUBLIC_`.
- Double-check before adding any `NEXT_PUBLIC_` var that it contains zero sensitive info.
