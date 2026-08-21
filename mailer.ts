// lib/mailer.ts — Email helper using Resend API
// Replaces includes/Mailer.php

export interface MailOptions {
  to: string;
  toName?: string;
  subject: string;
  body: string; // HTML
}

export async function sendMail(options: MailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY ?? '';
  const fromAddress = process.env.MAIL_FROM_ADDRESS ?? 'onboarding@resend.dev';
  const fromName = process.env.MAIL_FROM_NAME ?? 'IRM Extra';

  if (!apiKey) {
    console.error('[Mailer] RESEND_API_KEY is not configured.');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromAddress}>`,
        to: options.toName ? [`${options.toName} <${options.to}>`] : [options.to],
        subject: options.subject,
        html: options.body,
        text: options.body.replace(/<[^>]+>/g, '').replace(/\n\s*\n/g, '\n'),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Mailer] Resend API error:', err);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Mailer] Fetch error:', err);
    return false;
  }
}

export function buildStatusEmail(
  status: 'selected' | 'rejected',
  firstName: string,
  jobTitle: string
): { subject: string; body: string } {
  const safeFirst = firstName.replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] ?? c));
  const safeJob = jobTitle.replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] ?? c));

  if (status === 'selected') {
    return {
      subject: `Your application update: ${jobTitle}`,
      body: `<p>Dear ${safeFirst},</p>
             <p>Congratulations — you have been <strong>selected</strong> to move forward for the
             <strong>${safeJob}</strong> position. Our team will contact you shortly with next steps.</p>
             <p>Thank you,<br>IRM Extra Recruitment Team</p>`,
    };
  } else {
    return {
      subject: `Your application update: ${jobTitle}`,
      body: `<p>Dear ${safeFirst},</p>
             <p>Thank you for applying for the <strong>${safeJob}</strong> position. After careful
             consideration, we will not be moving forward with your application at this time.
             We appreciate your interest and encourage you to apply for future openings.</p>
             <p>Thank you,<br>IRM Extra Recruitment Team</p>`,
    };
  }
}
