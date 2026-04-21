import fs from 'fs';
const API_KEY = "AIzaSyA7jynh2JbS2trHAbO5hfnhWo5GLbQxd6o";
const MODEL_NAME = "nano-banana-pro-preview";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

async function testAPI() {
  console.log(`🚀 Bắt đầu gọi API tới: ${MODEL_NAME}...`);
  
  const payload = {
    contents: [{
      parts: [{
        text: "Generate a beautiful 4k photorealistic image of a futuristic neon glowing banana"
      }]
    }]
  };

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ Lỗi từ Google API:", JSON.stringify(data, null, 2));
      return;
    }

    console.log("✅ Gọi API Thành công!");
    
    // Tìm phần chứa ảnh (base64)
    const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part && part.inlineData && part.inlineData.data) {
      console.log("📸 Đã nhận được dữ liệu ảnh! Đang lưu thành file...");
      
      const base64Data = part.inlineData.data;
      const buffer = Buffer.from(base64Data, 'base64');
      
      const outputPath = './public/test_banana.jpeg'; // lưu ngay ra public
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`🎉 Xong! Hình ảnh Banana đã được lưu tại: ${outputPath}`);
    } else {
      console.log("⚠️ Không tìm thấy data hình ảnh trong response. Log:", JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error("❌ Lỗi mạng:", error.message);
  }
}

testAPI();
