# HLU TOOLS — Website giới thiệu dự án

Single-page tĩnh: `index.html` + `style.css` + `script.js`, không framework nặng, chạy ngay không cần build.

## Cách chạy
- Cách nhanh nhất: mở file `index.html` bằng trình duyệt (double-click).
- Hoặc chạy local server (để font / đường dẫn chuẩn hơn):
  ```bash
  cd hlu-tools-website
  python3 -m http.server 8000
  # mở http://localhost:8000
  ```

## Deploy
- **GitHub Pages:** push cả thư mục này lên repo, bật Pages (branch main, root).
- **Vercel / Netlify:** kéo-thả thư mục này vào dashboard là chạy, không cần cấu hình build.
- Lưu ý: trang này là trang giới thiệu mới, khác với web HLU TOOLS cũ đã đóng (hlutools.github.io/hlu về 404 từ 2026-11-01). Đừng gắn link cũ vào đây cho tới khi anh mở lại web đó.

## Cách chỉnh màu neon
Mở `style.css`, sửa block `:root` ở đầu file:
- `--vnpt: #00AEEF` (xanh VNPT chính)
- `--vnpt-dark: #0066B3`
- `--cyan: #00F0FF` (neon chính)
- `--violet: #7B61FF` (accent phụ)
- `--bg1 / --bg2`: nền tối gradient

Muốn bớt glow (máy yếu): giảm các giá trị `box-shadow` có `0 0 28px…` trong `.glass-card:hover` và `.btn-primary`.

## Cách thêm tool mới
Trong `index.html`, tìm `<div id="toolsGrid">`, copy 1 block `<article class="tool-card">` và sửa:
1. `data-category`: `tien-ich` | `toi-uu` | `hoc-tap` | `khac` (phải khớp nút filter).
2. Icon (emoji trong `.card-icon`), tên, mô tả.
3. Tag: `tag-free` (Miễn phí) | `tag-beta` (Beta) | `tag-soon` (Sắp ra mắt).
4. Nút “Chi tiết”: thay `href="#contact"` bằng link thật (trang tải / bài viết / repo).

## Những chỗ CẦN anh điền thật (đang để placeholder)
| Chỗ | Trong file | Ghi chú |
|---|---|---|
| Mô tả GHTT | `index.html` (card GHTT, có ghi `TODO`) | Chưa có mô tả thật nên không bịa |
| Link Facebook / GitHub / Zalo / cộng đồng | `index.html` (mục Liên hệ, `href="#"`) | Thay link thật vào |
| Email liên hệ | `index.html` (`mailto:hello@hlutools.example`) | Đang là email ví dụ |
| Số liệu 8+ / 25+ | `index.html` (mục `.stats`) | 25+ là số nội bộ đã biết; 8+ đếm theo số card hiện tại — sửa khi thêm/bớt tool |
| Mốc “Sắp tới” roadmap | `index.html` (timeline-item todo) | Chốt danh sách + thời gian rồi điền |
| Ảnh og:image | `assets/og-cover.svg` | Đang là ảnh SVG tự vẽ; thay bằng ảnh thật nếu muốn share Facebook đẹp hơn |

## Form liên hệ
Hiện chỉ là UI demo: bấm Gửi sẽ hiện “Đã nhận” nhưng **không gửi đi đâu** (không có backend).
Muốn gửi thật, cách nhẹ nhất: đăng ký Formspree (miễn phí), rồi trong `script.js` thay đoạn submit bằng `fetch` tới endpoint Formspree — hoặc thay form bằng link Google Form.

## Cấu trúc
```
index.html   — toàn bộ nội dung, SEO meta, anchor #home #about #tools #roadmap #values #contact
style.css    — theme neon VNPT, dark mode, glassmorphism, responsive
script.js    — menu mobile, reveal on scroll, counter, filter tools, cursor glow, form demo
assets/      — logo.svg, favicon.svg, og-cover.svg (placeholder, thay được)
```
