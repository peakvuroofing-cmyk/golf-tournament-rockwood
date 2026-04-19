import { RegistrationData } from '@/types';

const GOLD = '#c3a96a';
const BLACK = '#0f0f0f';

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(cents: number): string {
  return `$${cents.toLocaleString('en-US')}`;
}

function bbqRow(label: string, value?: string): string {
  if (!value) return '';
  return `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">${label}</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${value}</td></tr>`;
}

function playerRow(num: number, name?: string, handicap?: string): string {
  if (!name) return '';
  const hcp = handicap ? ` <span style="color:#6b7280;font-weight:400;">(HCP: ${handicap})</span>` : '';
  return `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Player ${num}</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${name}${hcp}</td></tr>`;
}

export function buildRegistrationConfirmationEmail(reg: RegistrationData): { subject: string; html: string; text: string } {
  const isTeam = reg.registration_type === 'team';
  const paymentLink = isTeam
    ? 'https://square.link/u/kdW42fA7?src=sheet'
    : 'https://square.link/u/BBm3kaNu?src=sheet';

  const playersHtml = [
    playerRow(1, reg.player_1_name, reg.handicap_1),
    playerRow(2, reg.player_2_name, reg.handicap_2),
    playerRow(3, reg.player_3_name, reg.handicap_3),
    playerRow(4, reg.player_4_name, reg.handicap_4),
  ].filter(Boolean).join('');

  const bbqHtml = [
    bbqRow(isTeam ? 'BBQ – Player 1' : 'BBQ Choice', reg.bbq_choice_1),
    bbqRow('BBQ – Player 2', reg.bbq_choice_2),
    bbqRow('BBQ – Player 3', reg.bbq_choice_3),
    bbqRow('BBQ – Player 4', reg.bbq_choice_4),
  ].filter(Boolean).join('');

  const subject = `Registration Confirmed – NorTex Society Golf Tournament (#${reg.submission_id})`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${BLACK};border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:${GOLD};font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">NorTex Society Presents</p>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">First Annual Charity Golf Tournament</h1>
              <p style="margin:8px 0 0 0;color:${GOLD};font-size:14px;">Rockwood Park Golf Course · June 20, 2026</p>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="background:${GOLD};padding:16px 40px;text-align:center;">
              <p style="margin:0;color:${BLACK};font-size:16px;font-weight:700;">Registration Confirmed</p>
              <p style="margin:4px 0 0 0;color:${BLACK};font-size:13px;opacity:0.8;">Confirmation #: <strong>${reg.submission_id}</strong></p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">
              <p style="margin:0 0 24px 0;font-size:16px;color:#111827;">
                Hi <strong>${reg.contact_first_name}</strong>,
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.6;">
                Thank you for registering for the <strong>NorTex Society First Annual Charity Golf Tournament</strong>!
                Your registration has been received. Please save your confirmation number and complete your payment below to secure your spot.
              </p>

              <!-- Confirmation Number Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ee;border:2px solid ${GOLD};border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 4px 0;font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;">Your Confirmation Number</p>
                    <p style="margin:0;font-size:24px;font-weight:800;color:${BLACK};letter-spacing:2px;">${reg.submission_id}</p>
                    <p style="margin:6px 0 0 0;font-size:12px;color:#6b7280;">Keep this for your records</p>
                  </td>
                </tr>
              </table>

              <!-- Order Summary -->
              <h3 style="margin:0 0 12px 0;font-size:16px;color:${BLACK};border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Order Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Registration Type</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">${isTeam ? 'Team Registration (4 Players)' : 'Individual Registration'}</td>
                </tr>
                ${isTeam && reg.team_name ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Team Name</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.team_name}</td></tr>` : ''}
                ${reg.company_or_organization ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Organization</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.company_or_organization}</td></tr>` : ''}
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Contact</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.contact_full_name}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Email</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.contact_email}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Phone</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.contact_phone}</td>
                </tr>
                <tr><td colspan="2" style="padding:8px 0;"><hr style="border:none;border-top:1px solid #e5e7eb;" /></td></tr>
                ${playersHtml}
                ${bbqHtml ? `<tr><td colspan="2" style="padding:8px 0;"><hr style="border:none;border-top:1px solid #e5e7eb;" /></td></tr>${bbqHtml}` : ''}
                ${reg.preferred_playing_partners ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Preferred Partners</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.preferred_playing_partners}</td></tr>` : ''}
                ${reg.sponsorship_interest ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Sponsorship</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#c3a96a;">Interested – we'll be in touch!</td></tr>` : ''}
                <tr><td colspan="2" style="padding:8px 0;"><hr style="border:none;border-top:2px solid #e5e7eb;" /></td></tr>
                <tr>
                  <td style="padding:6px 0;font-size:16px;font-weight:700;color:${BLACK};">Amount Due</td>
                  <td style="padding:6px 0;font-size:20px;font-weight:800;color:${BLACK};">${formatCurrency(reg.payment_amount)}</td>
                </tr>
              </table>

              <!-- Payment CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ee;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:${BLACK};">Payment Required to Confirm Your Spot</p>
                    <p style="margin:0 0 20px 0;font-size:13px;color:#6b7280;">If you haven't paid yet, click the button below to complete your secure Square payment.</p>
                    <a href="${paymentLink}" style="display:inline-block;background:${BLACK};color:${GOLD};font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">Complete Payment →</a>
                    <p style="margin:12px 0 0 0;font-size:12px;color:#9ca3af;">Secured by Square · Visa · Mastercard · Amex · Apple Pay</p>
                  </td>
                </tr>
              </table>

              <!-- Event Details -->
              <h3 style="margin:0 0 12px 0;font-size:16px;color:${BLACK};border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Event Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Date</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">${formatDate(reg.event_date)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Venue</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.venue_name}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Address</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.venue_address}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Registration Opens</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">7:00 AM</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:14px;">Shotgun Start</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;">8:00 AM</td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">
                Questions? Contact us at <a href="mailto:info@nortexsociety.com" style="color:${GOLD};">info@nortexsociety.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${BLACK};border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:${GOLD};font-size:13px;font-weight:600;">NorTex Society</p>
              <p style="margin:0;color:#6b7280;font-size:12px;">This is an automated confirmation. Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const bbqText = [
    reg.bbq_choice_1 ? `BBQ Choice: ${reg.bbq_choice_1}` : '',
    reg.bbq_choice_2 ? `BBQ Choice 2: ${reg.bbq_choice_2}` : '',
    reg.bbq_choice_3 ? `BBQ Choice 3: ${reg.bbq_choice_3}` : '',
    reg.bbq_choice_4 ? `BBQ Choice 4: ${reg.bbq_choice_4}` : '',
  ].filter(Boolean).join('\n');

  const text = `
NorTex Society First Annual Charity Golf Tournament
Registration Confirmed

Hi ${reg.contact_first_name},

Thank you for registering! Your confirmation number is: ${reg.submission_id}

ORDER SUMMARY
=============
Registration Type: ${isTeam ? 'Team Registration (4 Players)' : 'Individual Registration'}
${reg.team_name ? `Team Name: ${reg.team_name}\n` : ''}Contact: ${reg.contact_full_name}
Email: ${reg.contact_email}
Phone: ${reg.contact_phone}
${reg.company_or_organization ? `Organization: ${reg.company_or_organization}\n` : ''}
Players:
- Player 1: ${reg.player_1_name}${reg.handicap_1 ? ` (HCP: ${reg.handicap_1})` : ''}
${reg.player_2_name ? `- Player 2: ${reg.player_2_name}${reg.handicap_2 ? ` (HCP: ${reg.handicap_2})` : ''}\n` : ''}${reg.player_3_name ? `- Player 3: ${reg.player_3_name}${reg.handicap_3 ? ` (HCP: ${reg.handicap_3})` : ''}\n` : ''}${reg.player_4_name ? `- Player 4: ${reg.player_4_name}${reg.handicap_4 ? ` (HCP: ${reg.handicap_4})` : ''}\n` : ''}
${bbqText ? `${bbqText}\n` : ''}Amount Due: ${formatCurrency(reg.payment_amount)}

COMPLETE YOUR PAYMENT
=====================
${paymentLink}

EVENT DETAILS
=============
Date: ${formatDate(reg.event_date)}
Venue: ${reg.venue_name}
Address: ${reg.venue_address}
Registration Opens: 7:00 AM | Shotgun Start: 8:00 AM

Questions? Email info@nortexsociety.com

NorTex Society
  `.trim();

  return { subject, html, text };
}

/**
 * Post-payment confirmation — sent after Square returns successfully. No
 * payment CTA (payment is done); focus on what happens next and event details.
 */
export function buildPaymentConfirmedEmail(reg: RegistrationData): { subject: string; html: string; text: string } {
  const isTeam = reg.registration_type === 'team';
  const subject = `Payment Confirmed — You're In! NorTex Society Golf Tournament (#${reg.submission_id})`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="background:${BLACK};border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <p style="margin:0 0 4px 0;color:${GOLD};font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">NorTex Society Presents</p>
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">First Annual Charity Golf Tournament</h1>
          <p style="margin:8px 0 0 0;color:${GOLD};font-size:14px;">Rockwood Park Golf Course · June 20, 2026</p>
        </td></tr>

        <tr><td style="background:#10b981;padding:18px 40px;text-align:center;">
          <p style="margin:0;color:#ffffff;font-size:16px;font-weight:700;letter-spacing:1px;">✓ PAYMENT CONFIRMED</p>
          <p style="margin:4px 0 0 0;color:#ffffff;font-size:13px;opacity:0.9;">Your spot is officially reserved · #${reg.submission_id}</p>
        </td></tr>

        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 20px 0;font-size:16px;color:#111827;">Hi <strong>${reg.contact_first_name}</strong>,</p>
          <p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.6;">
            Payment received — <strong>${formatCurrency(reg.payment_amount)}</strong> for your ${isTeam ? 'team' : 'individual'} registration.
            We can't wait to see you at Rockwood Park on <strong>${formatDate(reg.event_date)}</strong>.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ee;border:2px solid ${GOLD};border-radius:12px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;">Confirmation Number</p>
              <p style="margin:0;font-size:24px;font-weight:800;color:${BLACK};letter-spacing:2px;">${reg.submission_id}</p>
              <p style="margin:6px 0 0 0;font-size:12px;color:#6b7280;">Keep for your records</p>
            </td></tr>
          </table>

          <h3 style="margin:0 0 12px 0;font-size:16px;color:${BLACK};border-bottom:2px solid #e5e7eb;padding-bottom:8px;">What's Next</h3>
          <ul style="margin:0 0 24px 0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8;">
            <li><strong>Arrive by 7:00 AM</strong> on Saturday, June 20, 2026</li>
            <li><strong>Shotgun start at 8:00 AM sharp</strong> — don't be late!</li>
            <li>BBQ lunch is included after the round (chicken or sausage + sides)</li>
            <li>Bring your A-game — prizes for low team, closest to the pin, longest drive</li>
          </ul>

          <h3 style="margin:0 0 12px 0;font-size:16px;color:${BLACK};border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Event Details</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Date</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${formatDate(reg.event_date)}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Venue</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.venue_name}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Address</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${reg.venue_address}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Pro Shop</td><td style="padding:4px 0;font-size:14px;font-weight:600;">(817) 392-6560</td></tr>
          </table>

          <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">
            Questions? Reply to this email or contact us at <a href="mailto:info@nortexsociety.com" style="color:${GOLD};">info@nortexsociety.com</a>
          </p>
        </td></tr>

        <tr><td style="background:${BLACK};border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
          <p style="margin:0 0 4px 0;color:${GOLD};font-size:13px;font-weight:600;">NorTex Society</p>
          <p style="margin:0;color:#6b7280;font-size:12px;">See you on the course. This is an automated message.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `NorTex Society First Annual Charity Golf Tournament
Payment Confirmed — You're In!

Hi ${reg.contact_first_name},

Payment received — ${formatCurrency(reg.payment_amount)}. Your spot is officially reserved.

Confirmation: ${reg.submission_id}

WHAT'S NEXT
- Arrive by 7:00 AM on ${formatDate(reg.event_date)}
- Shotgun start at 8:00 AM sharp
- BBQ lunch included after the round
- Prizes for low team, closest to the pin, longest drive

EVENT DETAILS
Venue: ${reg.venue_name}
Address: ${reg.venue_address}
Pro Shop: (817) 392-6560

Questions? info@nortexsociety.com

NorTex Society`.trim();

  return { subject, html, text };
}

/**
 * Owner/admin notification — sent to the tournament operator whenever a new
 * registration lands. Optimized for fast scanning: summary at the top,
 * full details below, direct mailto + phone links.
 */
export function buildOrderNotificationEmail(reg: RegistrationData): { subject: string; html: string; text: string } {
  const isTeam = reg.registration_type === 'team';
  const typeLabel = isTeam ? `Team — ${reg.team_name || 'Unnamed'}` : 'Individual';
  const paidLabel = reg.payment_status === 'paid' ? 'PAID' : 'Pending Payment';
  const paidColor = reg.payment_status === 'paid' ? '#10b981' : '#f59e0b';

  const subject = `New ${paidLabel === 'PAID' ? 'Paid' : ''} Registration — ${typeLabel} — ${formatCurrency(reg.payment_amount)} (#${reg.submission_id})`.replace(/\s+/g, ' ');

  const playerLines = [
    reg.player_1_name ? { n: 1, name: reg.player_1_name, hcp: reg.handicap_1, bbq: reg.bbq_choice_1 } : null,
    reg.player_2_name ? { n: 2, name: reg.player_2_name, hcp: reg.handicap_2, bbq: reg.bbq_choice_2 } : null,
    reg.player_3_name ? { n: 3, name: reg.player_3_name, hcp: reg.handicap_3, bbq: reg.bbq_choice_3 } : null,
    reg.player_4_name ? { n: 4, name: reg.player_4_name, hcp: reg.handicap_4, bbq: reg.bbq_choice_4 } : null,
  ].filter(Boolean) as Array<{n:number;name:string;hcp?:string;bbq?:string}>;

  const playersHtml = playerLines.map(p => `
    <tr>
      <td style="padding:6px 0;color:#6b7280;font-size:13px;width:90px;">Player ${p.n}</td>
      <td style="padding:6px 0;font-size:14px;font-weight:600;color:${BLACK};">
        ${p.name}
        ${p.hcp ? `<span style="color:#6b7280;font-weight:400;font-size:12px;"> · HCP ${p.hcp}</span>` : ''}
        ${p.bbq ? `<span style="color:${GOLD};font-weight:600;font-size:12px;"> · ${p.bbq}</span>` : ''}
      </td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:${BLACK};border-radius:16px 16px 0 0;padding:28px 40px;">
              <p style="margin:0 0 4px 0;color:${GOLD};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">NorTex Society · Tournament Operations</p>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">New Registration Received</h1>
            </td>
          </tr>

          <tr>
            <td style="background:${GOLD};padding:14px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:${BLACK};font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Status</td>
                  <td align="right" style="color:${BLACK};font-size:15px;font-weight:800;">
                    <span style="background:${paidColor};color:#ffffff;padding:4px 12px;border-radius:12px;font-size:11px;letter-spacing:1px;">${paidLabel}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:13px;width:130px;">Confirmation #</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:700;color:${BLACK};font-family:'Consolas',monospace;">${reg.submission_id}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:13px;">Type</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:${BLACK};">${isTeam ? 'Team Registration' : 'Individual'}${isTeam && reg.team_name ? ` — <span style="color:${GOLD};">${reg.team_name}</span>` : ''}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:13px;">Amount</td>
                  <td style="padding:6px 0;font-size:18px;font-weight:800;color:${BLACK};">${formatCurrency(reg.payment_amount)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:13px;">Submitted</td>
                  <td style="padding:6px 0;font-size:14px;color:${BLACK};">${reg.created_at}</td>
                </tr>
              </table>

              <h3 style="margin:0 0 10px 0;font-size:13px;color:${BLACK};border-bottom:1px solid #e5e7eb;padding-bottom:6px;letter-spacing:1.5px;text-transform:uppercase;">Contact</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:13px;width:90px;">Name</td>
                  <td style="padding:4px 0;font-size:14px;font-weight:600;color:${BLACK};">${reg.contact_full_name}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:13px;">Email</td>
                  <td style="padding:4px 0;font-size:14px;"><a href="mailto:${reg.contact_email}" style="color:${GOLD};text-decoration:none;font-weight:600;">${reg.contact_email}</a></td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:13px;">Phone</td>
                  <td style="padding:4px 0;font-size:14px;"><a href="tel:${reg.contact_phone.replace(/[^0-9+]/g,'')}" style="color:${GOLD};text-decoration:none;font-weight:600;">${reg.contact_phone}</a></td>
                </tr>
                ${reg.company_or_organization ? `
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-size:13px;">Company</td>
                  <td style="padding:4px 0;font-size:14px;color:${BLACK};">${reg.company_or_organization}</td>
                </tr>` : ''}
              </table>

              ${playersHtml ? `
              <h3 style="margin:0 0 10px 0;font-size:13px;color:${BLACK};border-bottom:1px solid #e5e7eb;padding-bottom:6px;letter-spacing:1.5px;text-transform:uppercase;">Players (${playerLines.length})</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                ${playersHtml}
              </table>` : ''}

              ${reg.preferred_playing_partners ? `
              <h3 style="margin:0 0 10px 0;font-size:13px;color:${BLACK};border-bottom:1px solid #e5e7eb;padding-bottom:6px;letter-spacing:1.5px;text-transform:uppercase;">Preferred Partners</h3>
              <p style="margin:0 0 20px 0;font-size:14px;color:${BLACK};line-height:1.5;">${reg.preferred_playing_partners}</p>` : ''}

              ${reg.notes ? `
              <h3 style="margin:0 0 10px 0;font-size:13px;color:${BLACK};border-bottom:1px solid #e5e7eb;padding-bottom:6px;letter-spacing:1.5px;text-transform:uppercase;">Notes from Registrant</h3>
              <p style="margin:0 0 20px 0;font-size:14px;color:${BLACK};line-height:1.5;background:#fef9f0;border-left:3px solid ${GOLD};padding:12px 16px;">${reg.notes}</p>` : ''}

              ${reg.sponsorship_interest ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9f0;border:2px solid ${GOLD};border-radius:10px;margin-bottom:20px;">
                <tr><td style="padding:14px 20px;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:${BLACK};">⚑ Sponsorship Interest Flagged</p>
                  <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">Registrant indicated interest in sponsorship opportunities — follow up recommended.</p>
                </td></tr>
              </table>` : ''}

              <p style="margin:20px 0 0 0;font-size:12px;color:#9ca3af;text-align:center;">
                Full details in the Google Sheet · Registrations tab
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:${BLACK};border-radius:0 0 16px 16px;padding:18px 40px;text-align:center;">
              <p style="margin:0;color:${GOLD};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">NorTex Society · Automated Notification</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const playersText = playerLines.map(p => `  Player ${p.n}: ${p.name}${p.hcp ? ` (HCP ${p.hcp})` : ''}${p.bbq ? ` · ${p.bbq}` : ''}`).join('\n');

  const text = `NEW REGISTRATION — NorTex Society Golf Tournament
================================================

Status:         ${paidLabel}
Confirmation:   ${reg.submission_id}
Type:           ${isTeam ? `Team — ${reg.team_name || 'Unnamed'}` : 'Individual'}
Amount:         ${formatCurrency(reg.payment_amount)}
Submitted:      ${reg.created_at}

CONTACT
-------
Name:    ${reg.contact_full_name}
Email:   ${reg.contact_email}
Phone:   ${reg.contact_phone}
${reg.company_or_organization ? `Company: ${reg.company_or_organization}\n` : ''}
${playersText ? `PLAYERS\n-------\n${playersText}\n\n` : ''}${reg.preferred_playing_partners ? `Preferred Partners: ${reg.preferred_playing_partners}\n\n` : ''}${reg.notes ? `NOTES\n-----\n${reg.notes}\n\n` : ''}${reg.sponsorship_interest ? '** SPONSORSHIP INTEREST FLAGGED — follow up recommended **\n\n' : ''}Full details in Google Sheet · Registrations tab
`.trim();

  return { subject, html, text };
}
