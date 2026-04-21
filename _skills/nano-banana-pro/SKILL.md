---
name: nano-banana-pro
description: Kỹ năng tạo ảnh chất lượng cao bằng API Nano Banana Pro (Gemini Image Generation). Sử dụng khi cần thiết kế ảnh banner, hero image, minh họa cho Landing Page, hoặc bất kỳ hình ảnh nào trong dự án. AI Agent PHẢI đọc skill này trước khi tạo ảnh bằng API.
---

# 🍌 NANO BANANA PRO — AI Image Generation Skill

> **Mục đích:** Tạo ảnh chất lượng cao trực tiếp từ text prompt, lưu vào dự án, và chèn ngay vào Landing Page / Web App mà không cần tải thủ công.

---

## 1. TỔNG QUAN

Nano Banana Pro là model tạo ảnh nội bộ của Google (codename cho Gemini 3 Pro Image Preview). Model này hỗ trợ:

- **Text-to-Image**: Mô tả bằng chữ → Nhận ảnh chất lượng cao
- **Thinking Mode**: Model có khả năng suy luận trước khi vẽ, cho kết quả chính xác hơn
- **Gọi qua REST API**: Dùng `fetch()` trong NodeJS, không cần cài SDK

### Thông tin model

| Thuộc tính | Giá trị |
|---|---|
| Model Name (API) | `nano-banana-pro-preview` |
| Model Alias | `gemini-3-pro-image-preview` |
| Display Name | Nano Banana Pro |
| Input Token Limit | 131,072 |
| Output Token Limit | 32,768 |
| Thinking | ✅ Có |
| Generation Method | `generateContent` |

---

## 2. CẤU HÌNH API

### 2.1 API Key

API Key được lưu tại biến cố định trong script. **KHÔNG BAO GIỜ** commit API key vào Git.

```
API_KEY = "AIzaSyA7jynh2JbS2trHAbO5hfnhWo5GLbQxd6o"
```

### 2.2 Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key={API_KEY}
```

### 2.3 Request Body Format

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Mô tả chi tiết hình ảnh cần tạo bằng tiếng Anh"
        }
      ]
    }
  ]
}
```

### 2.4 Response Format

API trả về JSON với ảnh được mã hóa base64 trong `inlineData`:

```json
{
  "candidates": [{
    "content": {
      "parts": [
        { "text": "..." },
        {
          "inlineData": {
            "mimeType": "image/png",
            "data": "<base64_encoded_image>"
          }
        }
      ]
    }
  }]
}
```

---

## 3. QUY TRÌNH TẠO ẢNH (STEP-BY-STEP)

### Bước 1: Viết Prompt Chất Lượng Cao

**QUY TẮC PROMPT:**
- **Luôn viết bằng tiếng Anh** — model hiểu tiếng Anh tốt nhất
- **Mô tả chi tiết**: phong cách, ánh sáng, góc chụp, màu sắc chủ đạo, bố cục
- **Chỉ định mục đích**: landing page hero, banner, icon, product mockup
- **Chỉ định kích thước/tỷ lệ nếu cần**: wide banner (16:9), square (1:1), portrait (9:16)

**Template prompt tốt:**
```
"Generate a [style] image of [subject]. [Details about composition]. 
[Lighting description]. [Color palette]. [Mood/atmosphere]. 
For use as [purpose] on a [context]. High quality, [resolution]."
```

**Ví dụ prompt theo use-case:**

| Use Case | Prompt Mẫu |
|---|---|
| Hero Banner | `"A wide cinematic hero banner showing a futuristic AI workspace with holographic screens, dark moody lighting with blue and purple neon accents, ultra-wide 21:9 aspect ratio, 4K quality, for a tech landing page"` |
| Speaker Photo BG | `"Professional corporate portrait background with soft gradient bokeh, navy blue to dark teal, elegant and clean, studio lighting setup, suitable for business headshot"` |
| Product Mockup | `"A sleek laptop mockup on a minimal desk showing a dashboard interface, isometric view, soft shadows, white clean background, premium product photography style"` |
| Icon/Illustration | `"A minimal flat illustration of a robot holding a golden trophy, vibrant gradients, geometric shapes, modern SaaS style, transparent background feel"` |
| Testimonial BG | `"Abstract wavy mesh gradient background in dark navy and subtle gold tones, minimalist, smooth organic shapes, suitable as section background"` |

### Bước 2: Tạo Script Tạo Ảnh

Tạo file script tạm trong **thư mục gốc** của dự án hiện tại (KHÔNG đặt ở /tmp):

```javascript
// File: generate_image_banana.js
import fs from 'fs';

const API_KEY = "AIzaSyA7jynh2JbS2trHAbO5hfnhWo5GLbQxd6o";
const MODEL = "nano-banana-pro-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// ═══ CẤU HÌNH ═══
const PROMPT = "YOUR_PROMPT_HERE";           // ← Thay bằng prompt thực tế
const OUTPUT_PATH = "./public/images/output.png";  // ← Thay bằng đường dẫn lưu ảnh

async function generateImage() {
  console.log("🚀 Đang gọi Nano Banana Pro...");
  console.log(`📝 Prompt: ${PROMPT.substring(0, 80)}...`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ API Error:", JSON.stringify(data, null, 2));
      return null;
    }

    // Tìm phần chứa ảnh base64
    const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (imagePart?.inlineData?.data) {
      const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
      
      // Tạo thư mục nếu chưa có
      const dir = OUTPUT_PATH.substring(0, OUTPUT_PATH.lastIndexOf('/'));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(OUTPUT_PATH, buffer);
      console.log(`✅ Ảnh đã được lưu tại: ${OUTPUT_PATH}`);
      console.log(`📐 Kích thước file: ${(buffer.length / 1024).toFixed(1)} KB`);
      return OUTPUT_PATH;
    } else {
      console.log("⚠️ Không nhận được ảnh. Response:");
      // In text response nếu có
      const textPart = data.candidates?.[0]?.content?.parts?.find(p => p.text);
      if (textPart) console.log(textPart.text);
      return null;
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
    return null;
  }
}

generateImage();
```

### Bước 3: Chạy Script

```bash
node generate_image_banana.js
```

Thời gian chờ: khoảng **5-15 giây** tùy độ phức tạp prompt.

### Bước 4: Chèn Ảnh Vào Code

Sau khi ảnh được lưu vào `public/images/`, chèn vào JSX/HTML:

```jsx
<img src="/images/output.png" alt="Mô tả ảnh" />
```

### Bước 5: Dọn Dẹp

Sau khi hoàn tất, **XÓA file script** `generate_image_banana.js` để không commit vào Git (chứa API key).

---

## 4. HƯỚNG DẪN CHO AI AGENT

Khi user yêu cầu tạo ảnh cho landing page hoặc web app, AI Agent PHẢI thực hiện đúng quy trình sau:

### 4.1 Quy Trình Bắt Buộc

1. **Phân tích yêu cầu**: Hiểu user muốn ảnh gì, dùng ở đâu (hero, banner, section bg, icon...)
2. **Viết prompt tiếng Anh**: Dựa trên yêu cầu, viết prompt chi tiết bằng tiếng Anh
3. **Tạo file script**: Tạo file `generate_image_banana.js` trong thư mục gốc dự án hiện tại với prompt và output path phù hợp (thường lưu vào `public/images/...`)
4. **Chạy script**: Dùng `node generate_image_banana.js` 
5. **Chờ kết quả**: Dùng `command_status` để theo dõi, chờ tối đa 30 giây
6. **Tạo Artifact Trình Chiếu Ảnh (BẮT BUỘC)**: Copy ảnh vừa tạo vào thư mục báo cáo (vd: `<appDataDir>\brain\<conversation-id>\`) bằng lệnh shell. Sau đó TẠO MỘT ARTIFACT markdown (`image_preview.md`) sử dụng cú pháp `![Preview](/absolute/path/to/copied/image.png)`. Đặt `RequestFeedback: true`.
7. **Dừng lại chờ User Duyệt**: Giải thích ngắn gọn và yêu cầu User xem trên bảng điều khiển Antigravity (giao diện Artifact) để xác nhận "Duyệt" hoặc yêu cầu chỉnh lại. KHÔNG ĐƯỢC CHÈN VÀO CODE KHI USER CHƯA DUYỆT.
8. **Chèn vào code**: Nếu User phản hồi đồng ý, tiến hành cập nhật file JSX/HTML để trỏ `src` tới ảnh mới trong thư mục `public/images/`.
9. **Xóa script tạm**: Xóa file `generate_image_banana.js` sau khi hoàn tất.

### 4.2 Quy Tắc Đặt Tên File Ảnh

```
public/images/{section}-{mô-tả}.png

Ví dụ:
public/images/hero-banner.png
public/images/speaker-portrait.png  
public/images/testimonial-bg.png
public/images/feature-ai-robot.png
public/images/course1/hero.png
```

### 4.3 Xử Lý Lỗi

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| 400 Bad Request | Prompt vi phạm policy hoặc sai format | Sửa lại prompt, tránh nội dung nhạy cảm |
| 429 Rate Limit | Gọi API quá nhiều | Chờ 30 giây rồi thử lại |
| 500 Server Error | Server Google tạm lỗi | Thử lại sau 10 giây, tối đa 3 lần |
| Không có inlineData | Model trả text thay vì ảnh | Thêm "Generate an image" vào đầu prompt |

### 4.4 Tối Ưu Chất Lượng Ảnh

- **Thêm style keywords**: `"photorealistic"`, `"4K"`, `"high quality"`, `"professional"`, `"cinematic lighting"`
- **Chỉ định negative**: Nếu cần tránh điều gì, mô tả rõ: `"no text overlay"`, `"no watermark"`  
- **Chỉ rõ composition**: `"centered"`, `"rule of thirds"`, `"wide angle"`, `"close-up"`
- **Chỉ rõ color scheme**: Để ảnh phù hợp palette của landing page

---

## 5. VÍ DỤ HOÀN CHỈNH

### Tình huống: User cần hero banner cho trang AI Coach

**Prompt:**
```
"A stunning wide cinematic hero banner for an AI coaching program landing page. 
Show a futuristic workspace with holographic AI interfaces floating in the air, 
a confident businessman silhouette in the center looking at data visualizations. 
Dark navy background with electric blue and warm gold accent lighting. 
Ultra-modern, premium feel, 16:9 aspect ratio, 4K photorealistic quality. 
No text overlay."
```

**Output path:** `./public/images/course3/hero-banner.png`

**Chèn vào code:**
```jsx
<section className="hero-section">
  <img 
    src="/images/course3/hero-banner.png" 
    alt="AI Coach Program - Huấn luyện AI chuyên nghiệp" 
    className="hero-image"
  />
</section>
```

---

## 6. LƯU Ý BẢO MẬT

> ⚠️ **QUAN TRỌNG:**
> - API Key **KHÔNG ĐƯỢC** commit vào Git
> - File script tạo ảnh phải được **XÓA SAU KHI DÙNG XONG**
> - Nếu cần lưu trữ key lâu dài, đặt vào file `.env` và thêm `.env` vào `.gitignore`
> - Nếu API key bị lộ, vào Google AI Studio để revoke và tạo key mới ngay lập tức
