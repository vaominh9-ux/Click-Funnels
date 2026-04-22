import fs from 'fs';

const API_KEY = "AIzaSyA7jynh2JbS2trHAbO5hfnhWo5GLbQxd6o";
const MODEL = "nano-banana-pro-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const IMAGES = [
  {
    prompt: "Abstract futuristic 3d illustration showing glowing data nodes and automation pipelines, neon emerald green and dark background, professional, premium enterprise software concept, clean, realistic, 4:3 aspect ratio, high quality, 4K.",
    path: "./public/images/course2/c2-automation.png"
  },
  {
    prompt: "A premium dashboard interface hovering on a modern executive glass desk in a corporate high-rise office at night, showing upward trending charts, dark blue color palette, professional business setting, photorealistic, cinematic lighting, 4:3 aspect ratio, high quality.",
    path: "./public/images/course2/c2-ads.png"
  },
  {
    prompt: "Close up of two executives in premium tailored suits shaking hands across a luxury modern office desk, overlooking a city skyline, cinematic professional B2B deal concept, photorealistic, warm luxury lighting, 4:3 aspect ratio, 4K.",
    path: "./public/images/course2/c2-agency.png"
  },
  {
    prompt: "A high-end modern media production desk setup with glowing monitors displaying video editing timelines, dark moody lighting with warm amber accents, professional aesthetic, realistic, 4:3 aspect ratio, 4K.",
    path: "./public/images/course2/c2-media.png"
  }
];

async function generateImage(prompt, outputPath) {
  console.log(`🚀 Đang tạo ảnh cho: ${outputPath}...`);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ API Error:", JSON.stringify(data, null, 2));
      return false;
    }

    const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (imagePart?.inlineData?.data) {
      const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Đã lưu: ${outputPath}`);
      return true;
    } else {
      console.log("⚠️ Không nhận được ảnh. Response text:", data.candidates?.[0]?.content?.parts?.find(p => p.text)?.text);
      return false;
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
    return false;
  }
}

async function runAll() {
  for (const img of IMAGES) {
    await generateImage(img.prompt, img.path);
    // Chờ 5 giây tránh rate limit
    await new Promise(r => setTimeout(r, 5000));
  }
  console.log("🎉 Hoàn tất sinh 4 ảnh!");
}

runAll();
