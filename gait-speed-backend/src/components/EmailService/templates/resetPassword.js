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

export default resetPasswordTemplate;