# 📰 TrangTin — Trang Tin Điện Tử (CMS Pro)

Website trang tin tức chuyên nghiệp cho phép người dùng đăng bài viết, bình luận và quản trị viên kiểm duyệt nội dung. Hệ thống được thiết kế với sự chú trọng đặc biệt vào **Toàn vẹn dữ liệu (Data Integrity)** và **Trải nghiệm người dùng (UX)**.

## 🚀 Công nghệ sử dụng

| Thành phần          | Công nghệ                                        |
| ------------------- | ------------------------------------------------ |
| **Backend**         | Node.js (v14+), Express.js 5.2.1                 |
| **Database**        | MongoDB Atlas, Mongoose 9.2.4                    |
| **Template Engine** | EJS 5.0.1                                        |
| **Authentication**  | bcryptjs 3.0.3, express-session, connect-mongo   |
| **Upload**          | Multer 2.1.1 (Hỗ trợ tối đa 10MB)                |
| **Soạn thảo**       | CKEditor 4.22.1                                  |
| **Frontend**        | Bootstrap 5, CSS custom, Sticky Footer (Flexbox) |
| **Thông báo**       | Bootstrap Toast (Real-time Feedback)             |

## 📁 Cấu trúc dự án

```text
├── index.js              # Điểm khởi đầu (Express setup, DB, Session, Global Error Handler)
├── .env                  # Biến môi trường (MONGO_URI)
├── models/               # Schema MongoDB
│   ├── taikhoan.js       # Tài khoản (HoVaTen, Email, HinhAnh, TenDangNhap, MatKhau, QuyenHan, KichHoat, BaiVietDaLuu)
│   ├── baiviet.js        # Bài viết (ChuDe, TaiKhoan, TieuDe, TomTat, NoiDung, NgayDang, LuotXem, KiemDuyet)
│   ├── binhluan.js       # Bình luận (BaiViet, TaiKhoan, NoiDung, NgayBinhLuan, KiemDuyet, BinhLuanCha)
│   └── chude.js          # Chủ đề (TenChuDe)
├── routers/              # Route handlers
│   ├── auth.js           # Đăng ký, Đăng nhập, Đăng xuất, Dashboard
│   ├── index.js          # Trang chủ, Chuyên mục, Chi tiết, Bình luận, Bookmark, Tìm kiếm, Upload
│   ├── baiviet.js        # CRUD bài viết, Duyệt bài, Bài viết của tôi
│   ├── chude.js          # CRUD chủ đề
│   ├── taikhoan.js       # CRUD tài khoản, Hồ sơ cá nhân
│   └── binhluan.js       # Quản lý bình luận
├── modules/              # Middleware & utilities
│   ├── middlewares.js    # isAuth, isAdmin
│   ├── upload.js         # Multer config (diskStorage, 10MB limit)
│   └── firstimage.js    # Trích xuất ảnh đầu tiên từ HTML
├── views/                # 28 files EJS (pages + partials)
│   ├── navbar.ejs / navbar_public.ejs   # Navigation bars
│   ├── footer.ejs / footer_public.ejs   # Footers
│   ├── toast.ejs                        # Thông báo Toast
│   └── ...                              # Admin CRUD + Public pages
└── public/               # Tài nguyên tĩnh
    ├── css/app.css       # Bootstrap 5.1.3 + CSS custom
    ├── js/app.js         # JS chung (timeago, Bootstrap bundle)
    ├── js/weather.js     # Widget thời tiết + đồng hồ
    ├── js/config.js      # CKEditor config
    └── images/uploads/   # Thư mục upload
```

## ✨ Tính năng nổi bật

### 💎 Toàn vẹn dữ liệu & Tối ưu quản trị

- **Xóa liên hoàn (Cascade Delete):** Khi xóa bài viết, hệ thống tự động dọn dẹp bình luận và gỡ bookmark của tất cả người dùng liên quan.
- **Chuyển nhượng tài khoản (Data Reassignment):** Khi xóa một tài khoản, toàn bộ bài viết và bình luận của họ được tự động chuyển về cho Admin, đảm bảo không bao giờ mất dữ liệu mồ côi.
- **Cơ chế Safety Shield:** Toàn bộ Views được bảo vệ bởi logic kiểm tra dữ liệu null-safe, ngăn chặn hoàn toàn lỗi sập trang.
- **Trạng thái Placeholder:** Hiển thị thông báo "Danh sách trống" trực quan cho tất cả bảng quản trị.
- **Chống xóa chủ đề:** Không cho phép xóa chủ đề khi còn bài viết liên quan.

### 📝 Trải nghiệm người viết & Độc giả

- **Chính sách Bài viết (Author Policy):** Tác giả chỉ được sửa khi bài chưa duyệt. Admin có chế độ `mode=admin` để ghi đè.
- **Bình luận đa cấp:** Hỗ trợ trả lời (Reply) 2 cấp, xóa bình luận gốc sẽ xóa toàn bộ phản hồi con.
- **Bookmark:** Lưu/bỏ lưu bài viết với trang "Đã lưu" có phân trang.
- **Bài viết liên quan:** Hiển thị tối đa 4 bài cùng chủ đề trong trang chi tiết.
- **Phân trang toàn diện:** Trang chủ (12 bài/trang), Chuyên mục (12 bài/trang), Tìm kiếm (10 bài/trang), Đã lưu (12 bài/trang).
- **Lượt xem thông minh:** Chống đếm lặp bằng session-based tracking.
- **Media Optimization:** Upload ảnh tối đa **10MB**, tự động responsive 100% chiều rộng kèm đổ bóng.
- **Tìm kiếm v2:** Tìm theo tiêu đề hoặc tóm tắt, có phân trang, chống ReDoS.

## 🔒 Bảo mật hệ thống

- Mã hóa mật khẩu bằng **bcrypt**.
- Middleware bảo vệ đa tầng (`isAuth`, `isAdmin`).
- Hệ thống chặn **IDOR** (kiểm tra quyền sở hữu ID).
- Chống **ReDoS** (escape regex người dùng nhập).
- Chặn xem bài chưa duyệt (chỉ Admin hoặc Tác giả).
- Chặn tự đổi quyền/khóa tài khoản chính mình.
- Toàn bộ hành động xóa/duyệt sử dụng **POST Method**.

## ⚙️ Hướng dẫn cài đặt

### Yêu cầu

- Node.js (v14+)
- MongoDB Atlas (SaaS)

### Các bước

1.  **Clone dự án:** `git clone ...`
2.  **Cài đặt:** `npm install`
3.  **Cấu hình:** Tạo file `.env` chứa `MONGO_URI`.
4.  **Khởi động:** `npm run dev` (phát triển) hoặc `npm start` (vận hành).
5.  **Truy cập:** `http://localhost:3000`

## 👨‍💻 Tác giả

- **Nguyễn Hoàng Thức** — [HoangZero-0](https://github.com/HoangZero-0)
- **Lê Nhật Quang**
