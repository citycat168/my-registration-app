// src/components/EmailService/templates/adminResetPassword.js
const adminResetPasswordTemplate = ({ 
    name, 
    resetUrl,
    logoUrl 
  }) => `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" 
             alt="KneeHow健康" 
             style="width: 120px; height: auto; margin-bottom: 15px;" />
        <h2 style="color: #2c3e50; margin-top: 15px;">管理員密碼重設</h2>
      </div>
      
      <p style="color: #34495e; font-size: 16px;">親愛的 ${name}：</p>
      
      <p style="color: #34495e; font-size: 16px; line-height: 1.6;">
        我們收到了您的密碼重設請求。請點擊下方按鈕重設您的密碼：
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          重設密碼
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        如果您並未要求重設密碼，請忽略此郵件。密碼重設連結將在30分鐘後失效。
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
        <p style="color: #7f8c8d; font-size: 12px;">此郵件由系統自動發送，請勿直接回覆。</p>
      </div>
    </div>
  `;
  
  export default adminResetPasswordTemplate;