// src/components/EmailService/templates/adminRegistrationConfirmation.js
const adminRegistrationConfirmation = ({ 
  applicantName,
  username,
  logoUrl,
  verifyUrl
}) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" 
           alt="KneeHow健康" 
           style="max-width: 120px; height: auto; margin-bottom: 15px;" />
      <h2 style="color: #2c3e50; margin-top: 15px;">管理員註冊確認</h2>
    </div>
    
    <p style="color: #34495e; font-size: 16px;">親愛的 ${applicantName}：</p>
    
    <p style="color: #34495e; font-size: 16px; line-height: 1.6;">感謝您註冊成為 KneeHow健康 的管理員。</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; border: 1px solid #e9ecef;">
      <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">您的註冊資訊</h3>
      <p style="margin-bottom: 10px;"><strong>帳號：</strong> ${username}</p>
      <p style="color: #495057; margin-bottom: 20px;">系統管理員將會與您聯絡並提供授權碼，以完成註冊程序。</p>
      
      <div style="margin-top: 20px; text-align: center;">
        <a href="${verifyUrl}?username=${encodeURIComponent(username)}" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          前往驗證頁面
        </a>
      </div>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">收到授權碼後，請點擊上方按鈕進入授權驗證頁面完成註冊。</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="color: #7f8c8d; font-size: 12px;">此郵件由系統自動發送，請勿直接回覆。</p>
    </div>
  </div>
`;

export default adminRegistrationConfirmation;