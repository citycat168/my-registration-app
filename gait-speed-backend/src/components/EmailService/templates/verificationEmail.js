// src/components/EmailService/templates/verificationEmail.js
export const verificationEmailTemplate = ({ name, verificationUrl }) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.FRONTEND_URL}/logo.png" alt="KneeHow健康" style="max-width: 150px;">
    </div>
    
    <h2 style="color: #2c3e50; text-align: center;">KneeHow健康會員註冊確認</h2>
    
    <p style="color: #34495e;">親愛的 ${name}：</p>
    
    <p style="color: #34495e;">感謝您註冊成為KneeHow健康會員！請點擊下方按鈕啟用您的帳號：</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" 
         style="background-color: #3498db; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 4px;
                display: inline-block;">
        啟用帳號
      </a>
    </div>
    
    <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
      此連結將於24小時後失效。若您並未註冊KneeHow健康會員，請忽略此信件。
    </p>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 12px;">
      <p>此為系統自動發送的郵件，請勿直接回覆。</p>
      <p>若您有任何問題，請聯繫我們的客服團隊。</p>
    </div>
  </div>
`;

// src/components/EmailService/templates/resetPassword.js
export const resetPasswordTemplate = ({ name, resetUrl }) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <h2 style="color: #2c3e50; text-align: center;">密碼重設請求</h2>
    
    <p style="color: #34495e;">親愛的 ${name}：</p>
    
    <p style="color: #34495e;">我們收到了您的密碼重設請求。請點擊下方按鈕重設您的密碼：</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background-color: #e74c3c; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 4px;
                display: inline-block;">
        重設密碼
      </a>
    </div>
    
    <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
      此連結將於1小時後失效。若您並未要求重設密碼，請忽略此信件。
    </p>
  </div>
`;

// src/components/EmailService/templates/welcomeEmail.js
export const welcomeEmailTemplate = ({ name }) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <h2 style="color: #2c3e50; text-align: center;">歡迎加入KneeHow健康</h2>
    
    <p style="color: #34495e;">親愛的 ${name}：</p>
    
    <p style="color: #34495e;">歡迎您成為KneeHow健康的會員！我們很高興能夠為您提供服務。</p>
    
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
      <h3 style="color: #2c3e50; margin-top: 0;">開始使用您的帳號</h3>
      <ul style="color: #34495e;">
        <li>完善您的個人資料</li>
        <li>探索我們的健康服務</li>
        <li>開始記錄您的健康數據</li>
      </ul>
    </div>
    
    <p style="color: #34495e;">
      如果您有任何問題，歡迎隨時聯繫我們的客服團隊。
    </p>
  </div>
`;