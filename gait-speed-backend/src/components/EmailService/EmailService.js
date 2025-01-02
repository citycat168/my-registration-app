// src/components/EmailService/EmailService.js
import nodemailer from 'nodemailer';
import { verificationEmailTemplate } from './templates/verificationEmail';
import { resetPasswordTemplate } from './templates/resetPassword';
import { welcomeEmailTemplate } from './templates/welcomeEmail';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    this.sender = process.env.EMAIL_FROM || 'KneeHow健康 <no-reply@kneehow.com>';
  }

  // 發送郵件的核心方法
  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: this.sender,
      to,
      subject,
      html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('郵件發送失敗');
    }
  }

  // 發送驗證郵件
  async sendVerificationEmail(to, data) {
    const { name, token } = data;
    const subject = 'KneeHow健康會員註冊確認信';
    const html = verificationEmailTemplate({
      name,
      verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${token}`,
    });

    return this.sendEmail(to, subject, html);
  }

  // 發送重設密碼郵件
  async sendResetPasswordEmail(to, data) {
    const { name, token } = data;
    const subject = 'KneeHow健康會員密碼重設';
    const html = resetPasswordTemplate({
      name,
      resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    });

    return this.sendEmail(to, subject, html);
  }

  // 發送歡迎郵件
  async sendWelcomeEmail(to, data) {
    const { name } = data;
    const subject = '歡迎加入KneeHow健康';
    const html = welcomeEmailTemplate({
      name,
    });

    return this.sendEmail(to, subject, html);
  }
}

export default new EmailService();