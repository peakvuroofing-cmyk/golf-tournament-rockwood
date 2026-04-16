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
