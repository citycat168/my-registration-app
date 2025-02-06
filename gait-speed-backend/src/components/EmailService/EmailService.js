// src/components/EmailService/EmailService.js
import nodemailer from 'nodemailer';
import verificationEmailTemplate from './templates/verificationEmail.js';
import resetPasswordTemplate from './templates/resetPassword.js';
import welcomeEmailTemplate from './templates/welcomeEmail.js';
import adminRegistrationConfirmation from './templates/adminRegistrationConfirmation.js';
import adminNotificationToSuperAdmin from './templates/adminNotificationToSuperAdmin.js';
import adminResetPasswordTemplate from './templates/adminResetPassword.js'; 
import config from '../../config/index.js'; 

// Logo URL 常量
const LOGO_URL = 'https://cdn.store-assets.com/s/611761/f/14647418.png';

class EmailService {
  constructor() {
    this.initializeService();
  }

  // 初始化服務
  async initializeService() {
    try {
      // 設置郵件傳輸器
      this.transporter = nodemailer.createTransport({
        service: config.email.service,
        auth: config.email.auth,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5
      });

      // 設置發件人
      this.sender = config.email.from;

      // 驗證郵件配置
      await this.transporter.verify();
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      throw new Error('郵件服務初始化失敗');
    }
  }

  // 發送郵件的核心方法
  async sendEmail(to, subject, html, retryCount = 3) {
    const mailOptions = {
      from: this.sender,
      to,
      subject,
      html
    };

    let lastError;
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`Email sent successfully on attempt ${attempt}:`, info.messageId);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        lastError = error;
        console.error(`Failed to send email (attempt ${attempt}/${retryCount}):`, error);
        
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw new Error(`郵件發送失敗 (after ${retryCount} attempts): ${lastError.message}`);
  }

  // 發送驗證郵件
  async sendVerificationEmail(to, data) {
    try {
      const { name, token } = data;
      const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;
      
      this.logEmailDetails('verification', { to, name, verificationUrl });

      const subject = 'KneeHow健康會員註冊確認信';
      const html = verificationEmailTemplate({ 
        name, 
        verificationUrl,
        logoUrl: LOGO_URL
      });

      return await this.sendEmail(to, subject, html);
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      throw new Error(`驗證郵件發送失敗: ${error.message}`);
    }
  }

  // 管理員註冊相關的郵件方法
  async sendAdminNotificationEmail(to, data) {
    try {
      const {
        applicantName,
        username,
        organization,
        phone,
        email,
        token
      } = data;

      // 發送給超級管理員的通知
      this.logEmailDetails('admin-notification-to-super', { 
        to: config.email.superAdmin, 
        name: applicantName,
        username,
        organization 
      });
      
      const superAdminSubject = 'KneeHow健康 - 新管理員註冊申請';
      const superAdminHtml = adminNotificationToSuperAdmin({
        applicantName,
        username,
        organization,
        phone,
        email,
        token,
        logoUrl: LOGO_URL,
        verifyUrl: `${config.frontendUrl}/admin/verify`
      });

      // 發送給申請者的確認郵件
      this.logEmailDetails('admin-registration-confirmation', {
        to: email,
        name: applicantName,
        username
      });

      const confirmationSubject = 'KneeHow健康 - 管理員註冊確認';
      const confirmationHtml = adminRegistrationConfirmation({
        applicantName,
        username,
        logoUrl: LOGO_URL,
        verifyUrl: `${config.frontendUrl}/admin/verify`
      });

      // 並行發送兩封郵件
      const [superAdminResult, userResult] = await Promise.all([
        this.sendEmail(config.email.superAdmin, superAdminSubject, superAdminHtml),
        this.sendEmail(email, confirmationSubject, confirmationHtml)
      ]);

      console.log('超級管理員通知郵件發送結果:', superAdminResult);
      console.log('申請者確認郵件發送結果:', userResult);

      return { 
        success: true,
        superAdminEmail: superAdminResult,
        userEmail: userResult
      };
    } catch (error) {
      console.error('Error in sendAdminNotificationEmail:', error);
      throw new Error(`管理員通知郵件發送失敗: ${error.message}`);
    }
  }

  // 發送重設密碼郵件
  async sendResetPasswordEmail(to, data) {
    try {
      const { name, token } = data;
      const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
      
      this.logEmailDetails('reset-password', { to, name, resetUrl });

      const subject = 'KneeHow健康會員密碼重設';
      const html = resetPasswordTemplate({ 
        name, 
        resetUrl,
        logoUrl: LOGO_URL
      });

      return await this.sendEmail(to, subject, html);
    } catch (error) {
      console.error('Error in sendResetPasswordEmail:', error);
      throw new Error(`重設密碼郵件發送失敗: ${error.message}`);
    }
  }

  // 在 EmailService 類中添加新方法
async sendAdminResetPasswordEmail(to, data) {
  try {
    const { name, token } = data;
    const resetUrl = `${config.frontendUrl}/admin/reset-password?token=${token}`;
    
    this.logEmailDetails('admin-reset-password', { to, name, resetUrl });

    const subject = 'KneeHow健康管理員密碼重設';
    const html = adminResetPasswordTemplate({ 
      name, 
      resetUrl,
      logoUrl: LOGO_URL
    });

    return await this.sendEmail(to, subject, html);
  } catch (error) {
    console.error('Error in sendAdminResetPasswordEmail:', error);
    throw new Error(`管理員重設密碼郵件發送失敗: ${error.message}`);
  }
}

  // 發送歡迎郵件
  async sendWelcomeEmail(to, data) {
    try {
      const { name } = data;
      
      this.logEmailDetails('welcome', { to, name });

      const subject = '歡迎加入KneeHow健康';
      const html = welcomeEmailTemplate({ 
        name,
        logoUrl: LOGO_URL
      });

      return await this.sendEmail(to, subject, html);
    } catch (error) {
      console.error('Error in sendWelcomeEmail:', error);
      throw new Error(`歡迎郵件發送失敗: ${error.message}`);
    }
  }

  // 記錄郵件詳情
  logEmailDetails(type, details) {
    console.log('Preparing to send email:');
    console.log(`- Type: ${type}`);
    console.log(`- To: ${details.to}`);
    console.log(`- Name: ${details.name}`);
    if (details.verificationUrl) console.log(`- Verification URL: ${details.verificationUrl}`);
    if (details.resetUrl) console.log(`- Reset URL: ${details.resetUrl}`);
    if (details.username) console.log(`- Username: ${details.username}`);
    if (details.organization) console.log(`- Organization: ${details.organization}`);
  }
}

// 創建並導出單例
const emailService = new EmailService();
export default emailService;