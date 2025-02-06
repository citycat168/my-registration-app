// src/components/EmailService/templates/adminNotificationToSuperAdmin.js
const adminNotificationToSuperAdmin = ({ 
  applicantName,
  username,
  organization,
  phone,
  email,
  token,
  logoUrl,
  verifyUrl
}) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" 
           alt="KneeHow健康" 
           style="max-width: 120px; height: auto; margin-bottom: 15px;" />
      <h2 style="color: #2c3e50; margin-top: 15px;">新管理員註冊申請通知</h2>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; border: 1px solid #e9ecef;">
      <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">申請者資訊</h3>
      <p style="margin-bottom: 10px;"><strong>姓名：</strong> ${applicantName}</p>
      <p style="margin-bottom: 10px;"><strong>帳號：</strong> ${username}</p>
      <p style="margin-bottom: 10px;"><strong>單位：</strong> ${organization}</p>
      <p style="margin-bottom: 10px;"><strong>電話：</strong> ${phone}</p>
      <p style="margin-bottom: 10px;"><strong>Email：</strong> ${email}</p>
      <p style="margin-bottom: 20px;"><strong>驗證碼：</strong> ${token}</p>
    </div>

    <div style="margin-top: 20px; text-align: center;">
      <a href="${verifyUrl}?username=${encodeURIComponent(username)}" 
         style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        前往驗證管理員帳號
      </a>
    </div>

    <div style="margin-top: 20px;">
      <p style="color: #666; font-size: 14px;">請確認申請者資料無誤後，點擊上方按鈕前往驗證頁面進行授權。</p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="color: #7f8c8d; font-size: 12px;">此郵件由系統自動發送，請勿直接回覆。</p>
    </div>
  </div>
`;

export default adminNotificationToSuperAdmin;