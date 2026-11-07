import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.isConfigured = false;
    this.transporter = null;

    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.isConfigured = true;
    }
  }

  async sendEmail({ to, subject, html, text }) {
    if (!this.isConfigured) {
      console.log('\n================ [DEV EMAIL SIMULATOR] ================');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body (Snippet): ${text || html?.substring(0, 160)}...`);
      console.log('========================================================\n');
      return { success: true, simulated: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'no-reply@sliceflow.com',
        to,
        subject,
        text,
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendVerificationEmail(to, name, token) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${clientUrl}/verify-email?token=${token}`;

    const subject = 'Verify your SliceFlow Account';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #E84736;">Welcome to SliceFlow, ${name}! 🍕</h2>
        <p>Thank you for joining SliceFlow. Please verify your email address to unlock your custom pizza builder and start ordering.</p>
        <div style="margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #E84736; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p style="color: #666; font-size: 13px;">If you didn't create an account, you can safely ignore this email.</p>
        <p style="color: #999; font-size: 12px;">Link: <a href="${verifyUrl}">${verifyUrl}</a></p>
      </div>
    `;

    return this.sendEmail({ to, subject, html, text: `Verify account: ${verifyUrl}` });
  }

  async sendPasswordResetEmail(to, token) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${token}`;

    const subject = 'Reset your SliceFlow Password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #E84736;">Password Reset Request</h2>
        <p>You recently requested to reset your password for your SliceFlow account. Click the button below to proceed.</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #202124; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 13px;">This link will expire in 1 hour. If you didn't make this request, please ignore this email.</p>
        <p style="color: #999; font-size: 12px;">Link: <a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `;

    return this.sendEmail({ to, subject, html, text: `Reset password: ${resetUrl}` });
  }

  async sendLowStockAlert(adminEmail, alerts) {
    const subject = `⚠️ SliceFlow Inventory Alert: ${alerts.length} Item(s) Below Threshold`;
    const alertRows = alerts
      .map(
        (a) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>${a.name}</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.category}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: #E84736; font-weight: bold;">${a.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.lowStockThreshold}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">Restock immediately</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #E84736;">🚨 Low Stock Inventory Warning</h2>
        <p>The automated SliceFlow inventory monitor detected items with stock levels below their configured safety thresholds:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f7f7f7;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Ingredient</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Category</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Current Stock</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Threshold</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${alertRows}
          </tbody>
        </table>
        <p>Please log in to the <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/inventory">Admin Inventory Dashboard</a> to replenish stock.</p>
      </div>
    `;

    return this.sendEmail({ to: adminEmail, subject, html, text: `Low stock detected for ${alerts.length} items.` });
  }
}

export default new EmailService();

