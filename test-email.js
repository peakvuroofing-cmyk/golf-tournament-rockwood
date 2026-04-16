// Quick email test — run with: node test-email.js
const fs = require('fs');

// Manually load .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx === -1) return;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, '');
  process.env[key] = val;
});

const to = 'c.whitworth07@gmail.com';

async function run() {
  console.log('Sending test email to:', to);

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'NorTex Society Golf Tournament', email: process.env.EMAIL_FROM },
      to: [{ email: to }],
      subject: '[TEST] Registration Confirmed – NorTex Society Golf Tournament (#TEST-20260415-0001)',
      htmlContent: buildHtml(),
      textContent: '[TEST] Email is working! Confirmation #TEST-20260415-0001 · Amount Due: $135',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('✗ Email failed:', JSON.stringify(data));
    process.exit(1);
  }

  console.log('✓ Test email sent successfully! Check your inbox at', to);
  console.log('  Message ID:', data.messageId);
}

function buildHtml() {
  const GOLD = '#c3a96a';
  const BLACK = '#0f0f0f';
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:${BLACK};border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
  <p style="margin:0 0 4px 0;color:${GOLD};font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">NorTex Society Presents</p>
  <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">First Annual Charity Golf Tournament</h1>
  <p style="margin:8px 0 0 0;color:${GOLD};font-size:14px;">Rockwood Park Golf Course · June 20, 2026</p>
</td></tr>
<tr><td style="background:${GOLD};padding:16px 40px;text-align:center;">
  <p style="margin:0;color:${BLACK};font-size:16px;font-weight:700;">[TEST] Registration Confirmed</p>
  <p style="margin:4px 0 0 0;color:${BLACK};font-size:13px;">Confirmation #: <strong>TEST-20260414-0001</strong></p>
</td></tr>
<tr><td style="background:#fff;padding:36px 40px;">
  <p style="font-size:16px;color:#111827;">Hi <strong>Chad</strong>,</p>
  <p style="font-size:15px;color:#374151;line-height:1.6;">This is a <strong>test email</strong>. If you're seeing this, your email system is working correctly!</p>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ee;border:2px solid ${GOLD};border-radius:12px;margin:24px 0;text-align:center;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 4px 0;font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;">Confirmation Number</p>
      <p style="margin:0;font-size:24px;font-weight:800;color:${BLACK};letter-spacing:2px;">TEST-20260414-0001</p>
    </td></tr>
  </table>

  <h3 style="font-size:16px;color:${BLACK};border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Order Summary</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Registration Type</td><td style="padding:4px 0;font-size:14px;font-weight:600;">Individual Registration</td></tr>
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Contact</td><td style="padding:4px 0;font-size:14px;font-weight:600;">Chad Whitworth</td></tr>
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Organization</td><td style="padding:4px 0;font-size:14px;font-weight:600;">NorTex Society</td></tr>
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Player 1</td><td style="padding:4px 0;font-size:14px;font-weight:600;">Chad Whitworth <span style="color:#6b7280;font-weight:400;">(HCP: 12)</span></td></tr>
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">BBQ Choice</td><td style="padding:4px 0;font-size:14px;font-weight:600;">Brisket</td></tr>
    <tr><td colspan="2" style="padding:8px 0;"><hr style="border:none;border-top:2px solid #e5e7eb;"/></td></tr>
    <tr><td style="padding:6px 0;font-size:16px;font-weight:700;color:${BLACK};">Amount Due</td><td style="padding:6px 0;font-size:20px;font-weight:800;color:${BLACK};">$135</td></tr>
  </table>

  <h3 style="font-size:16px;color:${BLACK};border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Event Details</h3>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Date</td><td style="padding:4px 0;font-size:14px;font-weight:600;">Saturday, June 20, 2026</td></tr>
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Venue</td><td style="padding:4px 0;font-size:14px;font-weight:600;">Rockwood Park Golf Course</td></tr>
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Address</td><td style="padding:4px 0;font-size:14px;font-weight:600;">1851 Jacksboro Hwy, Fort Worth, TX 76114</td></tr>
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Registration Opens</td><td style="padding:4px 0;font-size:14px;font-weight:600;">7:00 AM</td></tr>
    <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Shotgun Start</td><td style="padding:4px 0;font-size:14px;font-weight:600;">8:00 AM</td></tr>
  </table>
</td></tr>
<tr><td style="background:${BLACK};border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
  <p style="margin:0 0 4px 0;color:${GOLD};font-size:13px;font-weight:600;">NorTex Society</p>
  <p style="margin:0;color:#6b7280;font-size:12px;">This is an automated confirmation. Please do not reply to this email.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

run().catch(err => {
  console.error('✗ Unexpected error:', err.message);
  process.exit(1);
});
