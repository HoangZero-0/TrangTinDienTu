# 📰 TrangTin — Trang Tin Điện Tử

Website trang tin tức cho phép người dùng đăng bài viết, bình luận và quản trị viên kiểm duyệt nội dung. Xây dựng trên nền tảng Node.js với kiến trúc MVC.

## 🚀 Công nghệ sử dụng

| Thành phần          | Công nghệ                                        |
| ------------------- | ------------------------------------------------ |
| **Backend**         | Node.js, Express.js 5                            |
| **Database**        | MongoDB Atlas, Mongoose                          |
| **Template Engine** | EJS                                              |
| **Authentication**  | bcryptjs, express-session, connect-mongo         |
| **Upload**          | Multer                                           |
| **Soạn thảo**       | CKEditor 4                                       |
| **Frontend**        | Bootstrap 5, CSS custom, Sticky Footer (Flexbox) |
| **Env**             | dotenv                                           |

## 📁 Cấu trúc dự án

```
├── index.js            # Điểm khởi đầu ứng dụng
├── .env                # Biến môi trường (MONGO_URI) — không push lên Git
├── models/             # Schema MongoDB (TaiKhoan, ChuDe, BaiViet, BinhLuan)
├── routers/            # Route handlers (auth, baiviet, binhluan, chude, taikhoan, index)
├── modules/            # Middleware & utilities (auth check, upload, firstimage)
├── views/              # Giao diện EJS (pages + partials)
│   ├── navbar_public.ejs   # Navbar public (dùng chung)
│   ├── footer_public.ejs   # Footer public (dùng chung)
│   ├── navbar.ejs          # Navbar admin
│   └── ...                 # Các trang view
└── public/             # Tài nguyên tĩnh (CSS, JS, Images)
```

## ✨ Tính năng chính

### Người dùng (User)

- Đăng ký tài khoản (có upload ảnh đại diện)
- Đăng nhập / Đăng xuất
- Đăng bài viết (soạn thảo CKEditor, chờ admin duyệt)
- Sửa / Xóa bài viết của mình
- Gửi bình luận (sau khi đăng nhập)
- Trả lời bình luận (threaded comments — hỗ trợ 2 cấp: gốc và phản hồi)
- Lưu bài viết yêu thích (Bookmark) và xem lại danh sách đã lưu
- Cập nhật hồ sơ cá nhân

### Quản trị viên (Admin)

- Dashboard thống kê (chủ đề, bài viết, tài khoản)
- Duyệt / Bỏ duyệt bài viết và bình luận
- CRUD chủ đề (kiểm tra bài viết liên quan trước khi xóa)
- CRUD tài khoản (khóa / mở, đổi quyền)

### Độc giả (Guest)

- Xem trang chủ (phân trang 12 bài/trang, sidebar xem nhiều nhất + thẻ chuyên mục)
- Xem chi tiết bài viết (đếm lượt xem session-based, chống spam view)
- Xem 4 bài viết liên quan (cùng chuyên mục) ở cuối bài
- Tìm kiếm bài viết
- Xem bài theo chuyên mục (dropdown menu)
- Xem 50 tin mới nhất (`/tinmoi`)
- Trang Liên hệ, Chính sách riêng tư

## 🔒 Bảo mật

- Mã hóa mật khẩu bằng **bcrypt**
- Middleware phân quyền (`isAuth`, `isAdmin`)
- Chống **IDOR** (kiểm tra sở hữu bài viết)
- Chống **ReDoS** (escape regex tìm kiếm)
- **HTTP Method Safety** (xóa/duyệt dùng POST)
- MongoDB URI lưu trong `.env` (không hardcode)

## ⚙️ Hướng dẫn cài đặt

### Yêu cầu

- Node.js (v14+)
- MongoDB Atlas hoặc MongoDB local

### Các bước

**1. Clone dự án**

```bash
git clone https://github.com/YOUR_USERNAME/TrangTinDienTu.git
cd TrangTinDienTu
```

**2. Cài đặt dependencies**

```bash
npm install
```

**3. Tạo file `.env`**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trangtin
```

**4. Chạy ứng dụng**

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Truy cập: `http://localhost:3000`

## 👨‍💻 Tác giả

- **Nguyễn Hoàng Thức** — [HoangZero-0](https://github.com/HoangZero-0)
- **Lê Nhật Quang**
