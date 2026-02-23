import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmation(
  to: string,
  orderNumber: string,
  total: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"KNOVO" <${process.env.SMTP_USER}>`,
      to,
      subject: `Order Confirmed — ${orderNumber}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #0B1F3B;">
          <div style="background: #0B1F3B; padding: 32px; text-align: center;">
            <h1 style="color: #C6A75E; margin: 0; font-size: 28px; letter-spacing: 4px;">KNOVO</h1>
          </div>
          <div style="padding: 40px 32px;">
            <h2 style="color: #0B1F3B;">Thank you for your order.</h2>
            <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
            <p>Total: <strong>CAD ${total}</strong></p>
            <p>We'll send you a shipping confirmation once your order is on its way.</p>
            <p style="margin-top: 40px; color: #666; font-size: 14px;">KNOVO — Premium Men's Accessories | Canada</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send failed:', err);
  }
}

export async function sendAdminOrderNotification(
  orderNumber: string,
  customerEmail: string,
  total: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"KNOVO System" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order: ${orderNumber}`,
      html: `
        <p>New order received.</p>
        <p>Order: <strong>${orderNumber}</strong></p>
        <p>Customer: ${customerEmail}</p>
        <p>Total: CAD ${total}</p>
      `,
    });
  } catch (err) {
    console.error('Admin notification failed:', err);
  }
}

export async function sendPasswordReset(to: string, resetUrl: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"KNOVO" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Reset Your KNOVO Password',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #0B1F3B;">
          <div style="background: #0B1F3B; padding: 32px; text-align: center;">
            <h1 style="color: #C6A75E; margin: 0; font-size: 28px; letter-spacing: 4px;">KNOVO</h1>
          </div>
          <div style="padding: 40px 32px;">
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display: inline-block; background: #0B1F3B; color: #C6A75E; padding: 12px 24px; text-decoration: none; margin-top: 16px;">Reset Password</a>
            <p style="margin-top: 24px; color: #666; font-size: 13px;">If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Password reset email failed:', err);
  }
}
