// src/components/EmailService/templates/passwordChanged.js
export const passwordChangedTemplate = ({ name }) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <h2 style="color: #2c3e50; text-align: center;">密碼更改通知</h2>
    
    <p style="color: #34495e;">親愛的 ${name}：</p>
    
    <p style="color: #34495e;">您的密碼已經成功更改。如果這不是您本人操作，請立即聯繫我們。</p>
    
    <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
      此郵件為系統自動發送，請勿回覆。
    </p>
  </div>
`;

// 在 EmailService 類中添加新方法
async sendPasswordChangedEmail(to, data) {
  try {
    const { name } = data;
    
    this.logEmailDetails('password-changed', { to, name });

    const subject = 'KneeHow健康 - 密碼更改通知';
    const html = passwordChangedTemplate({ 
      name,
      logoBase64: this.logoBase64 
    });

    return await this.sendEmail(to, subject, html);
  } catch (error) {
    console.error('Error sending password changed email:', error);
    throw new Error('發送密碼更改通知郵件失敗');
  }
}