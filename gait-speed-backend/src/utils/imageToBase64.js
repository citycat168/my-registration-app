// src/utils/imageToBase64.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getLogoBase64 = async () => {
  try {
    const logoPath = path.join(__dirname, '../../public/logo.png');
    console.log('Reading logo from path:', logoPath);
    
    const imageBuffer = await fs.readFile(logoPath);
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;
    
    // 添加詳細日誌
    console.log('Logo processing details:', {
      fileExists: true,
      fileSize: imageBuffer.length,
      base64Length: base64Image.length,
      dataUrlLength: dataUrl.length,
      dataUrlPreview: dataUrl.substring(0, 100) + '...'
    });
    
    return dataUrl;
  } catch (error) {
    console.error('Error loading logo:', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack
    });
    return null;
  }
};