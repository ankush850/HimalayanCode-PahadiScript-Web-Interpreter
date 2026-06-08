import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

const HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PahadiScript Verification</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f7f9fa;
      margin: 0;
      padding: 0;
      color: #333333;
    }
    .wrapper {
      width: 100%;
      background-color: #f7f9fa;
      padding: 40px 0;
      text-align: center;
    }
    .container {
      max-width: 480px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.06);
      text-align: left;
    }
    .header {
      background: linear-gradient(135deg, #0f0f10 0%, #222225 100%);
      padding: 45px 30px;
      text-align: center;
    }
    .logo {
      max-height: 70px;
      width: auto;
      margin-bottom: 15px;
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 35px;
      text-align: center;
    }
    .content p {
      font-size: 15px;
      line-height: 1.6;
      color: #555555;
      margin-top: 0;
      margin-bottom: 30px;
    }
    .otp-container {
      background-color: #f3f4f6;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
      border: 1px solid rgba(0, 0, 0, 0.03);
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #111111;
      margin: 0;
      padding-left: 8px;
    }
    .expiry {
      font-size: 13px;
      color: #888888;
      margin: 0;
    }
    .footer {
      background-color: #fafbfc;
      padding: 25px 30px;
      text-align: center;
      border-top: 1px solid #eeeeee;
    }
    .footer p {
      font-size: 12px;
      color: #aaaaaa;
      margin: 0;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img class="logo" src="https://i.ibb.co/JRzLG4wG/logo.png" alt="PahadiScript Logo">
        <h1>PahadiScript</h1>
      </div>
      <div class="content">
        <p>Namaste! Welcome back to the mountain interpreter. To access your workspace, code creations, and sandbox dashboard, please verify your identity using the verification code below:</p>
        <div class="otp-container">
          <h2 class="otp-code">DYNAMIC_OTP_HERE</h2>
        </div>
        <p class="expiry">This verification code is confidential and will expire in 5 minutes.</p>
      </div>
      <div class="footer">
        <p>If you did not request this log in, you can safely ignore this email.<br>&copy; 2026 PahadiScript. Created in the Heights.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not defined in environment variables.');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    // 1. Security Check (webhook secret verification)
    if (WEBHOOK_SECRET) {
      const authHeader = request.headers.get('authorization');
      const customSecretHeader = request.headers.get('x-supabase-webhook-secret');
      
      const expectedBearer = `Bearer ${WEBHOOK_SECRET}`;
      if (authHeader !== expectedBearer && customSecretHeader !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized: Webhook secret mismatch' }, { status: 401 });
      }
    }

    // 2. Extract payload from Supabase hook
    const payload = await request.json();
    const email = payload.user?.email;
    const token = payload.token;

    if (!email || !token) {
      return NextResponse.json({ error: 'Missing email or token in payload' }, { status: 400 });
    }

    // 3. Inject the OTP Token dynamically
    const htmlContent = HTML_TEMPLATE.replace('DYNAMIC_OTP_HERE', token);

    // 4. Send Email via Resend
    // NOTE: On Resend free tier without a custom verified domain, you must send FROM 'onboarding@resend.dev'
    // and you can only send TO the email address you registered your Resend account with.
    // Once you verify a custom domain, you can change 'onboarding@resend.dev' to 'PahadiScript <noreply@yourdomain.com>'.
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: 'PahadiScript Verification Code',
      html: htmlContent,
    });

    if (error) {
      console.error('Resend sending failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error('Send OTP API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
