// src/components/EmailService/templates/welcomeEmail.js
export const welcomeEmailTemplate = ({ name, logoBase64 }) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <div style="text-align: center; margin-bottom: 20px;">
      ${logoBase64 ? 
        `<img src="${logoBase64}" alt="KneeHow健康" style="max-width: 150px;">` :
        `<div style="font-size: 24px; font-weight: bold; color: #2c3e50;">KneeHow健康</div>`
      }
    </div> 
  
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

export default welcomeEmailTemplate;