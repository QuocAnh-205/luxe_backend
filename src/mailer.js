// Gửi email. Chọn kênh theo ENV:
//   MAIL_PROVIDER=ses  -> AWS SES (EC2 dùng IAM role của máy, không cần access key)
//   MAIL_PROVIDER=smtp -> SMTP bất kỳ (Gmail App Password, Mailtrap...): SMTP_HOST/PORT/USER/PASS
//   (để trống)         -> chỉ ghi ra log, dùng khi dev/test
const PROVIDER = (process.env.MAIL_PROVIDER || '').toLowerCase();
const FROM = process.env.MAIL_FROM || 'LUXE <no-reply@luxe.vn>';

let transport;
function getTransport() {
  if (transport) return transport;
  if (PROVIDER === 'ses') {
    const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
    const client = new SESv2Client({ region: process.env.AWS_REGION || 'ap-southeast-1' });
    transport = async ({ to, subject, html, text }) =>
      client.send(
        new SendEmailCommand({
          FromEmailAddress: FROM,
          Destination: { ToAddresses: [to] },
          Content: {
            Simple: {
              Subject: { Data: subject, Charset: 'UTF-8' },
              Body: { Html: { Data: html, Charset: 'UTF-8' }, Text: { Data: text, Charset: 'UTF-8' } },
            },
          },
        })
      );
  } else if (PROVIDER === 'smtp') {
    const nodemailer = require('nodemailer');
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    transport = (msg) => t.sendMail({ from: FROM, ...msg });
  } else {
    transport = async ({ to, subject, text }) => console.log(`[mail:log] To: ${to} | ${subject}\n${text}`);
  }
  return transport;
}

const isConfigured = () => PROVIDER === 'ses' || PROVIDER === 'smtp';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function otpEmail({ name: rawName, otp, minutes }) {
  const name = escapeHtml(rawName);
  const text = `Xin chào ${rawName},\n\nMã xác thực đặt lại mật khẩu LUXE của bạn là: ${otp}\nMã có hiệu lực trong ${minutes} phút.\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.`;
  const html = `<!doctype html><html><body style="margin:0;background:#f7f4ef;font-family:Arial,Helvetica,sans-serif;color:#111">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:16px;overflow:hidden">
      <tr><td style="background:#111;padding:24px;text-align:center;font:700 26px Georgia,serif;letter-spacing:6px;color:#e7c98f">LUXE</td></tr>
      <tr><td style="padding:32px 32px 8px">
        <p style="margin:0 0 12px;font-size:16px">Xin chào <b>${name}</b>,</p>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#444">Dùng mã dưới đây để đặt lại mật khẩu tài khoản LUXE. Mã có hiệu lực trong <b>${minutes} phút</b>.</p>
        <div style="text-align:center;margin:0 0 24px"><span style="display:inline-block;padding:16px 28px;background:#f7f4ef;border:1px dashed #b8925a;border-radius:12px;font:700 32px 'Courier New',monospace;letter-spacing:10px">${otp}</span></div>
        <p style="margin:0 0 24px;font-size:13px;color:#777;line-height:1.6">Không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên LUXE. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
      </td></tr>
      <tr><td style="padding:16px;text-align:center;font-size:12px;color:#999;border-top:1px solid #eee">© LUXE Fashion Store</td></tr>
    </table>
  </td></tr></table></body></html>`;
  return { subject: `${otp} là mã đặt lại mật khẩu LUXE`, text, html };
}

async function sendOtpEmail(to, { name, otp, minutes }) {
  await getTransport()({ to, ...otpEmail({ name, otp, minutes }) });
}

module.exports = { sendOtpEmail, isConfigured };
