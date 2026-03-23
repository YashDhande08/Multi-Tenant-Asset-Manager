const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM, NODE_ENV } = require('../config/env');

const isEmailConfigured = () => {
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && EMAIL_FROM);
};

const getTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const sendInviteEmail = async ({ to, inviteUrl, tenantName }) => {
  if (!isEmailConfigured()) {
    // For local dev, keep invite flow working even without SMTP.
    // The inviteUrl is still returned by the API.
    if (NODE_ENV === 'development') return { skipped: true };
    throw new Error('Email service is not configured');
  }

  const transporter = getTransporter();

  const subject = tenantName
    ? `You're invited to join ${tenantName}`
    : `You're invited to join`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">You're invited</h2>
      <p style="margin: 0 0 12px;">
        Click the button below to set your password and activate your account.
      </p>
      <p style="margin: 16px 0;">
        <a href="${inviteUrl}" style="display:inline-block; background:#2563eb; color:#fff; padding:10px 14px; border-radius:6px; text-decoration:none;">
          Accept invitation
        </a>
      </p>
      <p style="margin: 0 0 8px; color:#6b7280; font-size: 12px;">
        If the button doesn't work, copy and paste this link:
      </p>
      <p style="margin: 0; font-size: 12px; word-break: break-all;">
        ${inviteUrl}
      </p>
    </div>
  `;

  return await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendInviteEmail,
};

