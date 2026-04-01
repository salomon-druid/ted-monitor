import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');
  _resend = new Resend(apiKey);
  return _resend;
}

const FROM_EMAIL = process.env.ALERT_FROM_EMAIL || 'TenderWatch <alerts@ted-monitor.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ted-monitor-six.vercel.app';

interface AlertNotice {
  id: number;
  notice_id: string | null;
  title: string | null;
  buyer_name: string | null;
  country: string | null;
  cpv_code: string | null;
  deadline: string | null;
  estimated_value: number | null;
  estimated_value_currency: string | null;
  bid_fit_score: number;
}

function formatValue(value: number | null, currency: string | null): string {
  if (!value) return '—';
  return `${(value / 1000).toFixed(0)}k ${currency || 'EUR'}`;
}

function scoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // amber
  return '#6b7280'; // gray
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Fit';
  if (score >= 60) return 'Good Fit';
  return 'Moderate Fit';
}

function buildAlertHtml(notices: AlertNotice[], email: string): string {
  const noticeRows = notices
    .map(
      (n) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">
        <a href="${SITE_URL}/notices/${n.id}" style="color: #1a1a2e; text-decoration: none; font-weight: 500; font-size: 14px;">
          ${n.title || 'Untitled Notice'}
        </a>
        <div style="color: #6b7280; font-size: 12px; margin-top: 4px;">
          ${n.buyer_name || 'Unknown Buyer'} · ${n.country || '—'}
        </div>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; text-align: center;">
        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; color: white; background-color: ${scoreColor(n.bid_fit_score)};">
          ${n.bid_fit_score}% ${scoreLabel(n.bid_fit_score)}
        </span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; text-align: right; font-size: 13px; color: #374151; white-space: nowrap;">
        ${formatValue(n.estimated_value, n.estimated_value_currency)}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; text-align: right; font-size: 13px; color: #374151; white-space: nowrap;">
        ${n.deadline ? new Date(n.deadline).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) : '—'}
      </td>
    </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="padding: 24px 24px 20px; border-bottom: 1px solid #e5e7eb;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size: 20px; font-weight: 700; color: #1a1a2e;">
              🔔 TenderWatch
            </td>
            <td style="text-align: right; font-size: 12px; color: #9ca3af;">
              ${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 24px;">
        <h1 style="margin: 0 0 8px; font-size: 18px; color: #1a1a2e;">
          ${notices.length} neue passende Ausschreibung${notices.length !== 1 ? 'en' : ''}
        </h1>
        <p style="margin: 0 0 20px; font-size: 14px; color: #6b7280; line-height: 1.5;">
          Wir haben ${notices.length} Ausschreibung${notices.length !== 1 ? 'en' : ''} gefunden, die zu Ihrem Unternehmensprofil passen.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Ausschreibung</th>
              <th style="padding: 10px 16px; text-align: center; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Bid-Fit</th>
              <th style="padding: 10px 16px; text-align: right; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Wert</th>
              <th style="padding: 10px 16px; text-align: right; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Frist</th>
            </tr>
          </thead>
          <tbody>
            ${noticeRows}
          </tbody>
        </table>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${SITE_URL}/notices" style="display: inline-block; padding: 12px 28px; background-color: #1a1a2e; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
            Alle Ausschreibungen ansehen
          </a>
        </div>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding: 16px 24px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
          Sie erhalten diese E-Mail, weil Sie Ausschreibungs-Alerts bei TenderWatch aktiviert haben.<br>
          <a href="${SITE_URL}/dashboard?alerts=manage" style="color: #6b7280; text-decoration: underline;">Alert-Einstellungen ändern</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendAlertEmail(
  email: string,
  notices: AlertNotice[]
): Promise<{ success: boolean; error?: string }> {
  if (notices.length === 0) return { success: true };

  try {
    const resend = getResend();
    const html = buildAlertHtml(notices, email);
    const subject =
      notices.length === 1
        ? `Neue Ausschreibung: ${notices[0].title?.slice(0, 60) || 'Passendes Angebot'} (${notices[0].bid_fit_score}%)`
        : `${notices.length} neue passende Ausschreibungen`;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Email send error:', err);
    return { success: false, error: err.message };
  }
}

export async function sendTestAlertEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const testNotices: AlertNotice[] = [
    {
      id: 0,
      notice_id: 'TEST-001',
      title: 'Rahmenvertrag IT-Dienstleistungen — Cloud-Migration und Managed Services',
      buyer_name: 'Bundesamt für IT',
      country: 'DE',
      cpv_code: '72000000',
      deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
      estimated_value: 2500000,
      estimated_value_currency: 'EUR',
      bid_fit_score: 92,
    },
    {
      id: 0,
      notice_id: 'TEST-002',
      title: 'Gebäudereinigung und Facility Services — Standort München',
      buyer_name: 'Landeshauptstadt München',
      country: 'DE',
      cpv_code: '50000000',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      estimated_value: 450000,
      estimated_value_currency: 'EUR',
      bid_fit_score: 78,
    },
  ];

  return sendAlertEmail(email, testNotices);
}
