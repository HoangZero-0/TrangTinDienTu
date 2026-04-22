# 📰 TrangTin — Trang Tin Điện Tử (CMS Pro)

Website trang tin tức chuyên nghiệp được xây dựng trên nền tảng **Node.js** và **MongoDB**, cho phép người dùng đăng bài, bình luận và quản trị viên kiểm duyệt nội dung. Hệ thống tập trung vào tính toàn vẹn dữ liệu, hiệu năng và trải nghiệm người dùng hiện đại.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

| Thành phần    | Công nghệ                                       | Phiên bản         |
| :------------ | :---------------------------------------------- | :---------------- |
| **Backend**   | Node.js (Runtime) & Express.js (Framework)      | v14+ / 5.2.1      |
| **Database**  | MongoDB Atlas (Cloud Database)                  | v9.2.4 (Mongoose) |
| **Session**   | express-session & connect-mongo (Session Store) | 1.19.0 / 6.0.0    |
| **Template**  | EJS (Embedded JavaScript)                       | 5.0.1             |
| **Auth**      | bcryptjs (Mã hóa mật khẩu)                      | 3.0.3             |
| **Upload**    | Multer (Xử lý tải lên file tối đa 10MB)         | 2.1.1             |
| **Soạn thảo** | CKEditor 4 (Full Featured)                      | 4.22.1            |
| **Frontend**  | Bootstrap 5, jQuery, Bootstrap Icons            | 5.3.3 / 3.7.1     |

---

## 📁 Cấu trúc dự án

```text
├── index.js              # Entry point (Setup Express, DB, Session, Middleware, Error Handler)
├── .env                  # Biến môi trường (MONGO_URI) - [Bảo mật]
├── models/               # Định nghĩa Schema (TaiKhoan, BaiViet, BinhLuan, ChuDe)
├── routers/              # Xử lý Logic & Điều hướng (6 routers chuyên biệt)
├── modules/              # Middlewares (Auth) & Utilities (Upload, Image Processor)
├── public/               # Tài nguyên tĩnh
│   ├── css/app.css       # Custom Styles & Bootstrap support
│   ├── js/weather.js     # Widget Thời tiết & Đồng hồ vệ tinh (Fixed UI)
│   └── images/uploads/   # Thư mục lưu trữ ảnh tải lên
└── views/                # Giao diện EJS (Admin & Public - 28 files)
    ├── partials/         # Navbar, Footer, Toast, JS scripts
    └── ...               # Các trang quản trị và hiển thị nội dung
```

---

## ✨ Tính năng nổi bật

### 💎 Quản trị & Toàn vẹn dữ liệu

- **Live Search Filter:** Chức năng lọc dữ liệu tức thì tại các bảng quản trị (Bài viết, Chủ đề, Tài khoản...) sử dụng jQuery (Client-side).
- **Xóa liên hoàn (Cascade Delete):** Tự động dọn dẹp bình luận và bookmark khi xóa bài viết hoặc bình luận gốc.
- **Chuyển nhượng dữ liệu:** Tự động chuyển quyền sở hữu bài viết về Admin khi xóa tài khoản để không làm mất nội dung.
- **Logic Chủ đề v2:** Kiểm tra trùng tên chủ đề không phân biệt hoa thường (Case-insensitive unique).
- **Auth Protection:** Middleware đa lớp bảo vệ quyền Admin và quyền sở hữu bài viết (Authorship).

### 📝 Trải nghiệm người dùng (UX)

- **Header Double-Fixed:** Hệ thống Header 2 tầng (Thời tiết/Thời gian phía trên, Menu phía dưới) luôn cố định khi cuộn trang.
- **Giao diện Responsive:** Tối ưu hiển thị trên mọi thiết bị. Hình ảnh trong bài viết tự động thích ứng 100% chiều rộng.
- **Bình luận đa cấp:** Hỗ trợ phản hồi (Reply) phân cấp rõ rệt.
- **Bookmark & Xem nhiều:** Hệ thống lưu bài viết yêu thích và thống kê lượt xem thông minh (chống đếm lặp qua session).
- **Weather & Time Widget:** Tích hợp dữ liệu thời tiết thực tế từ OpenWeatherMap và giờ vệ tinh chính xác.

---

## 🔒 Bảo mật & Tối ưu

- **An toàn Mật khẩu:** Mã hóa 1 chiều với bcrypt.
- **Chống IDOR & ReDoS:** Kiểm tra quyền hạn nghiêm ngặt và xử lý regex an toàn trước khi tìm kiếm.
- **Quản lý Session:** Lưu trữ session trong MongoDB (connect-mongo) giúp ổn định và bền bỉ.
- **Error Handling:** Hệ thống bắt lỗi tập trung (Global Error Handler) đảm bảo website không bao giờ bị sập trắng trang.

---

## ⚙️ Hướng dẫn cài đặt & Vận hành

### 1. Yêu cầu hệ thống

- **Node.js** v14.x trở lên.
- **MongoDB** (Khuyến khích dùng MongoDB Atlas).

### 2. Các bước thiết lập

1. **Clone project:** `git clone <repo_url>`
2. **Cài đặt thư viện:** `npm install`
3. **Cấu hình môi trường:** Tạo file `.env` tại thư mục gốc với nội dung:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/trangtin
   PORT=3000
   ```
4. **Chạy ứng dụng:**
   - Chế độ phát triển: `npm run dev` (tự động restart khi sửa code).
   - Chế độ vận hành: `npm start`.

---

## 🌐 Dịch vụ API & Cloud ứng dụng

- **Rendering:** [Render.com](https://render.com) (Hosting & Deployment).
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud DB).
- **Weather API:** [OpenWeatherMap](https://openweathermap.org/).
- **Time API:** [WorldTimeAPI](http://worldtimeapi.org/).

---

## 👨‍💻 Tác giả

- **Nguyễn Hoàng Thức** — [HoangZero-0](https://github.com/HoangZero-0)
- **Lê Nhật Quang**
