# 📰 TrangTin — Trang Tin Điện Tử (CMS Pro)

Website trang tin tức chuyên nghiệp cho phép người dùng đăng bài viết, bình luận và quản trị viên kiểm duyệt nội dung. Hệ thống được thiết kế với sự chú trọng đặc biệt vào **Toàn vẹn dữ liệu (Data Integrity)** và **Trải nghiệm người dùng (UX)**.

## 🚀 Công nghệ sử dụng

| Thành phần          | Công nghệ                                        |
| ------------------- | ------------------------------------------------ |
| **Backend**         | Node.js, Express.js 5                            |
| **Database**        | MongoDB Atlas, Mongoose                          |
| **Template Engine** | EJS                                              |
| **Authentication**  | bcryptjs, express-session, connect-mongo         |
| **Upload**          | Multer (Hỗ trợ tối đa 10MB)                      |
| **Soạn thảo**       | CKEditor 4                                       |
| **Frontend**        | Bootstrap 5, CSS custom, Sticky Footer (Flexbox) |
| **Thông báo**       | Bootstrap Toast (Real-time Feedback)             |

## 📁 Cấu trúc dự án

```text
├── index.js            # Điểm khởi đầu ứng dụng (Global Error Handler)
├── .env                # Biến môi trường (MONGO_URI)
├── models/             # Schema MongoDB (TaiKhoan, ChuDe, BaiViet, BinhLuan)
├── routers/            # Route handlers (auth, baiviet, binhluan, chude, taikhoan, index)
├── modules/            # Middleware & utilities (auth check, upload, firstimage)
├── views/              # Giao diện EJS (pages + partials)
│   ├── navbar_public.ejs   # Navbar public (Bộ lọc safety shield)
│   ├── footer_public.ejs   # Footer public (Sticky footer)
│   ├── toast.ejs           # Component thông báo tập trung
│   └── ...                 # Các quản trị & người dùng
└── public/             # Tài nguyên tĩnh (CSS, JS, Images)
```

## ✨ Tính năng nổi bật (v3.0)

### 💎 Toàn vẹn dữ liệu & Tối ưu quản trị

- **Xóa liên hoàn (Cascade Delete):** Khi xóa bài viết, hệ thống tự động dọn dẹp bình luận và gỡ bookmark của tất cả người dùng liên quan.
- **Chuyển nhượng tài khoản (Data Reassignment):** Khi xóa một tài khoản, toàn bộ bài viết và bình luận của họ được tự động chuyển về cho Admin thực hiện hành động, giúp đảm bảo trang tin không bao giờ bị mất dữ liệu mồ côi.
- **Cơ chế Safety Shield:** Toàn bộ Views được bảo vệ bởi logic kiểm tra dữ liệu null-safe, ngăn chặn hoàn toàn lỗi sập trang (Crash) từ dữ liệu lỗi.
- **Trạng thái Placeholder:** Hiển thị thông báo "Danh sách trống" trực quan cho tất cả các bảng quản trị (Admin Tables).

### 📝 Trải nghiệm người viết & Độc giả

- **Chính sách Bài viết (Author Policy):** Tác giả chỉ được chỉnh sửa bài viết khi chưa duyệt. Sau khi đăng công khai, bản quyền thuộc về Ban biên tập. Admin có chế độ `mode=admin` để ghi đè.
- **Media Optimization:** Hỗ trợ upload ảnh lên đến **10MB**. Ảnh trong nội dung tự động tương thích (Responsive) 100% chiều rộng khung kèm đổ bóng cao cấp.
- **Tìm kiếm v2:** Tìm kiếm bài viết có hỗ trợ phân trang (Pagination), tối ưu cho cơ sở dữ liệu lớn.
- **Bình luận đa cấp:** Hỗ trợ trả lời (Reply) 2 cấp, xóa bình luận gốc sẽ xóa toàn bộ phản hồi con.

## 🔒 Bảo mật hệ thống

- Mã hóa mật khẩu bằng **bcrypt**.
- Middleware bảo vệ đa tầng (`isAuth`, `isAdmin`).
- Hệ thống chặn **IDOR** (kiểm tra quyền sở hữu ID).
- Chống **ReDoS** (escape regex người dùng nhập).
- Toàn bộ hành động xóa/duyệt sử dụng **POST Method**.

## ⚙️ Hướng dẫn cài đặt

### Yêu cầu

- Node.js (v14+)
- MongoDB Atlas (SaaS)

### Các bước

1.  **Clone dự án:** `git clone ...`
2.  **Cài đặt:** `npm install`
3.  **Cấu hình:** Tạo file `.env` chứa `MONGO_URI`.
4.  **Khởi động:** `npm run dev` (dành cho phát triển) hoặc `npm start` (dành cho vận hành).

## 👨‍💻 Tác giả

- **Nguyễn Hoàng Thức** — [HoangZero-0](https://github.com/HoangZero-0)
- **Lê Nhật Quang**
