/**
 * Send one test confirmation email through the same code path the app uses
 * (nodemailer → Gmail SMTP). Verifies EMAIL_* env vars in .env.local are live.
 *
 * Usage:
 *   node scripts/test-email.js <recipient@example.com>
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Load .env.local manually (no next runtime here)
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found at', envPath);
  process.exit(1);
}
const envText = fs.readFileSync(envPath, 'utf8');
let inQuotes = false, key = '', buf = '';
for (const line of envText.split('\n')) {
  if (inQuotes) {
    buf += '\n' + line;
    if (line.endsWith('"')) {
      process.env[key] = buf.slice(0, -1);
      inQuotes = false; key = ''; buf = '';
    }
    continue;
  }
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const k = trimmed.slice(0, eq).trim();
  let v = trimmed.slice(eq + 1);
  if (v.startsWith('"') && !v.endsWith('"')) {
    inQuotes = true; key = k; buf = v.slice(1); continue;
  }
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  process.env[k] = v;
}

const to = process.argv[2];
if (!to) {
  console.error('Usage: node scripts/test-email.js <recipient@example.com>');
  process.exit(1);
}

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;
if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
  console.error('Missing EMAIL_HOST / EMAIL_USER / EMAIL_PASS in .env.local');
  process.exit(1);
}

async function main() {
  const port = parseInt(EMAIL_PORT || '587');
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port,
    secure: port === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  console.log(`Sending test email from ${EMAIL_USER} → ${to} via ${EMAIL_HOST}:${port}...`);

  const info = await transport.sendMail({
    from: `"NorTex Society Golf Tournament" <${EMAIL_FROM || EMAIL_USER}>`,
    to,
    subject: '[TEST] NorTex Golf Tournament email is working',
    text: 'If you received this, EMAIL_HOST / EMAIL_USER / EMAIL_PASS in .env.local are valid and the app can send registration confirmations.',
    html: `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:auto;padding:24px;border:2px solid #c3a96a;border-radius:12px;">
      <h2 style="margin:0 0 12px;color:#0f0f0f;">✅ Email is working</h2>
      <p style="color:#374151;line-height:1.6;">
        If you received this, your Gmail SMTP credentials in <code>.env.local</code> are correct
        and the NorTex Golf Tournament app can send registration confirmation emails.
      </p>
      <p style="color:#6b7280;font-size:13px;margin-top:24px;">Sent via nodemailer · ${EMAIL_HOST}:${port}</p>
    </div>`,
  });

  console.log('✓ Sent. Message ID:', info.messageId);
  console.log('  Response:', info.response);
}

main().catch(err => {
  console.error('✗ Send failed:', err.message);
  if (err.code === 'EAUTH') {
    console.error('  Hint: for Gmail, EMAIL_PASS must be a 16-char App Password');
    console.error('        (not your account password). Generate at:');
    console.error('        https://myaccount.google.com/apppasswords');
  }
  process.exit(1);
});
