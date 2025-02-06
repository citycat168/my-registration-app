// src/components/EmailService/templates/verificationEmail.js

const verificationEmailTemplate = ({ name, verificationUrl,logoBase64 }) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <div style="text-align: center; margin-bottom: 20px;">
      ${logoBase64 ? 
        `<img src="${logoBase64}" alt="KneeHow健康" style="max-width: 150px;">` :
        `<div style="font-size: 24px; font-weight: bold; color: #2c3e50;">KneeHow健康</div>`
      }
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

export default verificationEmailTemplate;