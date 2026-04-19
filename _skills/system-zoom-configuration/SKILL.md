---
name: system-zoom-configuration
description: Hướng dẫn tích hợp cơ chế Tỷ lệ Thu Phóng (UI Zoom Scale) toàn hệ thống. Giải quyết triệt để lỗi CSS 100vh bị hụt chân trên Layout.
---

# 🔎 Cơ Chế Tỷ Lệ Thu Phóng Hệ Thống (System Zoom Scaling)

Kỹ năng này cung cấp kiến trúc chuẩn để thiết lập tính năng **Thu phóng giao diện (UI Zoom)** cho các hệ thống ERP, Dashboard hoặc Web App cần hiển thị nhiều dữ liệu trên bảng biểu (`80%`, `90%`, v.v.).

Khi được yêu cầu "tích hợp tính năng Zoom/Thu phóng" cho hệ thống, AI Agent CẦN bắt buộc tuân theo 3 giai đoạn kiến trúc chuẩn hóa sau đây để tránh gây vỡ layout toàn cục.

---

## 1. Init (Khởi tạo ở Root App)

Tại file Component chạy đầu tiên của toàn bộ ứng dụng (thường là `App.jsx`, `main.jsx` hoặc `_app.tsx`), cần chèn một đoạn code đọc và kích hoạt thủ công CSS Zoom ngay khi ứng dụng Load. Cơ chế này nên vô hiệu hóa (fallback về 100%) nếu phát hiện ứng dụng đang mở trên Mobile (<= 768px).

**Code Mẫu (React `App.jsx`):**
```javascript
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.body.style.zoom = "100%";
      document.documentElement.style.setProperty('--ui-zoom', 1);
    } else {
      const currentZoom = localStorage.getItem('cf_ui_zoom') || '80%';
      document.body.style.zoom = currentZoom;
      // Trích xuất số thực (vd: 80% => 0.8) để gán cho biến môi trường CSS
      document.documentElement.style.setProperty('--ui-zoom', parseFloat(currentZoom) / 100);
    }
  }, []);
```

---

## 2. CSS Compensation (Bù Trừ 100vh)

**⚠ LỖI NGHIÊM TRỌNG THƯỜNG GẶP:** 
Khi dùng thuộc tính `zoom: 0.8` của trình duyệt, nếu hệ thống có các cột Sidebar hoặc Navigation dùng chiều cao tuyệt đối là `height: 100vh`, khoảng không gian đó sẽ bị "co rút" lại theo tỷ lệ 80%, làm hở ra một khoảng trắng lộ liễu dưới đáy màn hình.

**GIẢI PHÁP BẮT BUỘC:** 
Đối với TẤT CẢ các thẻ CSS có chứa `100vh` (như Sidebar, Wrap Container...), phải chia thông số đó cho CSS Variable `--ui-zoom`. Tức là zoom 0.8 thì thẻ 100vh sẽ được hô biến thành `125vh` để bù đắp sự hụt chân.

**Code Mẫu (CSS):**
```css
.sidebar-container {
    /* KHÔNG DÙNG: height: 100vh; */
    height: calc(100vh / var(--ui-zoom, 1));
}

.main-layout {
    min-height: calc(100vh / var(--ui-zoom, 1));
}
```

---

## 3. UI Control (Điều khiển từ Settings)

Tạo một Form UI trong màn hình Cài Đặt để người dùng (Admin) chọn các tỷ lệ như 80%, 90%, 100%. 

**Logic Handler:**
Khi người dùng bấm chọn một mức Zoom, cần thực hiện đồng thời 4 tác vụ:
1. Gán lại state Hook React.
2. Ghi biến xuống chuỗi LocalStorage để nhớ cho lần rết trình duyệt.
3. Kích hoạt trực tiếp `document.body.style.zoom`.
4. Kích hoạt trực tiếp biến `document.documentElement.style.setProperty('--ui-zoom')`.

**Code Mẫu (Settings.jsx):**
```javascript
import React, { useState } from 'react';

const ZoomSettings = () => {
  const [uiZoom, setUiZoom] = useState(localStorage.getItem('cf_ui_zoom') || '100%');
  const zoomLevels = ['80%', '90%', '100%', '110%', '120%'];

  const applyZoom = (zoomValue) => {
    setUiZoom(zoomValue);
    localStorage.setItem('cf_ui_zoom', zoomValue);
    
    // Áp dụng zoom native
    document.body.style.zoom = zoomValue;
    
    // Áp dụng bù trừ CSS Variable
    const zoomVal = parseFloat(zoomValue) / 100;
    document.documentElement.style.setProperty('--ui-zoom', zoomVal);
  };

  return (
    <div className="zoom-controls">
      <label>Tỷ lệ hiển thị (Web):</label>
      <div className="zoom-btn-group">
        {zoomLevels.map((zoom) => (
          <button 
            key={zoom}
            onClick={() => applyZoom(zoom)}
            className={uiZoom === zoom ? 'active' : ''}
          >
            {zoom}
          </button>
        ))}
      </div>
    </div>
  );
};
```
