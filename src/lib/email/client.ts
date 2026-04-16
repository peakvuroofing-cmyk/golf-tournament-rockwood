import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error('Missing email configuration: EMAIL_HOST, EMAIL_USER, and EMAIL_PASS are required.');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const transport = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transport.sendMail({
    from: `"NorTex Society Golf Tournament" <${from}>`,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}

export function isEmailConfigured(): boolean {
  return !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
}
