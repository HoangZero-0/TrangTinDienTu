# 1. TỔNG QUAN DỰ ÁN (PROJECT META)

- **Tên dự án:** TrangTin
- **Mục tiêu cốt lõi:** Website trang tin tức cho phép người dùng đăng bài, bình luận và quản trị viên kiểm duyệt nội dung.
- **Nền tảng đích:** Web Application (Node.js/Express)

# 2. TECH STACK (CÔNG NGHỆ SỬ DỤNG)

- **Ngôn ngữ chính:** JavaScript (Node.js v14+)
- **Frameworks/Libraries:** Express.js 5, Mongoose (MongoDB), EJS (Template Engine), bcryptjs (Auth), multer (Upload), express-session, connect-mongo (Session Store), dotenv (Biến môi trường).
- **Database:** MongoDB Atlas.
- **Khác:** CKEditor 4.22.1 (soạn thảo bài viết), Bootstrap 5.1.3 (public) / 5.3.3 CDN (admin).

# 3. KIẾN TRÚC & CẤU TRÚC THƯ MỤC (ARCHITECTURE & STRUCTURE)

- **Mô hình kiến trúc:** MVC (Model-View-Controller).
- **Cấu trúc thư mục cốt lõi:**
  ```text
  /models           # Định nghĩa Schema MongoDB (TaiKhoan, ChuDe, BaiViet, BinhLuan)
  /routers          # Xử lý Route và Logic điều hướng (auth, baiviet, index, chude, taikhoan, binhluan)
  /modules          # Các hàm tiện ích và Middleware (middlewares.js, upload.js, firstimage.js)
  /views            # Giao diện EJS (pages + partials)
    navbar.ejs          # Navbar trang admin
    navbar_public.ejs   # Navbar trang public (partial dùng chung 7 trang)
    footer.ejs          # Footer trang admin
    footer_public.ejs   # Footer trang public (partial dùng chung 7 trang)
    toast.ejs           # Component thông báo Toast (Bootstrap 5)
  /public           # Tài nguyên tĩnh (CSS, JS, Images)
    /css/app.css        # Bootstrap 5.1.3 minified + CSS custom + Sticky Footer (Flexbox)
    /js/app.js          # JS chung (timeago, Bootstrap bundle)
    /js/weather.js      # Widget thời tiết + đồng hồ
    /js/config.js       # CKEditor custom config
  index.js          # Điểm khởi đầu ứng dụng (Express setup, DB connect, middlewares)
  .env              # Biến môi trường (MONGO_URI) - KHÔNG push lên Git
  ```

# 4. QUY CHUẨN MÃ NGUỒN (CODING CONVENTIONS)

- **Naming Convention:**
  - Models: PascalCase (e.g., `TaiKhoan`, `BaiViet`).
  - Biến/Hàm: camelCase hoặc Tiếng Việt không dấu tùy ngữ cảnh cũ.
- **Error Handling:** Global Error Handler (Express 5 auto-catch async errors) + try/catch cho các thao tác database quan trọng. Thông báo lỗi qua `req.session.error`, thành công qua `req.session.success`, hiển thị tức thì qua hệ thống **Bootstrap Toast**. Đặc biệt: Xử lý lỗi `LIMIT_FILE_SIZE` (10MB) của Multer tập trung tại `index.js`, trả về JSON cho CKEDITOR `/upload`.
- **Security:**
  - Mã hóa mật khẩu bằng bcrypt.
  - Middleware `isAuth` và `isAdmin` bảo vệ route nhạy cảm.
  - Chống IDOR: kiểm tra sở hữu bài viết trước khi sửa/xóa. **Tác giả chỉ được sửa bài khi chưa duyệt.** Admin có quyền `?mode=admin` để ghi đè.
  - Chống ReDoS: escape regex trước khi dùng `RegExp` cho tìm kiếm.
  - HTTP Method Safety: các route xóa/duyệt dùng POST.

# 5. NGHIỆP VỤ & THỰC THỂ CHÍNH (DOMAIN & CORE ENTITIES)

- **Các Model cốt lõi:**
  - `TaiKhoan`: HoVaTen, Email, HinhAnh, TenDangNhap (unique), MatKhau (bcrypt hashed), QuyenHan (user/admin), KichHoat (0/1), BaiVietDaLuu (array of refs).
  - `ChuDe`: TenChuDe (unique, required). **Chặn xóa nếu còn bài viết liên quan.**
  - `BaiViet`: ChuDe (ref), TaiKhoan (ref), TieuDe, TomTat, NoiDung, NgayDang, LuotXem, KiemDuyet (0/1). **Xóa bài tự động dọn dẹp bình luận và bookmark.**
  - `BinhLuan`: BaiViet (ref), TaiKhoan (ref), NoiDung, NgayBinhLuan, KiemDuyet (0/1), BinhLuanCha (ref). **Xóa bình luận gốc tự động xóa toàn bộ phản hồi con.**

# 6. LUỒNG HOẠT ĐỘNG CHÍNH (CORE FLOWS)

## Flow 1: Đăng ký & Đăng nhập

- **Đăng ký:** Upload ảnh đại diện (multer), kiểm tra mật khẩu xác nhận, hash bcrypt, kiểm tra trùng TenDangNhap + trùng Email.
- **Tài khoản mồ côi:** Khi xóa tài khoản, tất cả bài viết/bình luận của họ được **Chuyển nhượng (Reassign)** về cho Admin thực hiện lệnh xóa để bảo toàn dữ liệu trang web.

## Flow 2: Quản lý bài viết (Tác giả)

- Đăng bài → chờ duyệt. Sửa bài: Chỉ được phép sửa khi bài ở trạng thái chờ duyệt. Một khi bài đã đăng công khai, chỉ Admin mới có quyền sửa đổi.
- **Media:** Dung lượng tải lên tối đa **10MB**. Ảnh trong bài viết tự động thích ứng (Responsive) 100% chiều rộng khung.

## Flow 3: Kiểm duyệt & Quản trị (Admin)

- Quản lý toàn bộ danh sách Bài viết, Chủ đề, Tài khoản, Bình luận.
- Chế độ ghi đè: Sử dụng query parameter `?mode=admin` để chỉnh sửa mọi bài viết bất kể tình trạng kiểm duyệt.
- Quản lý giao diện: Phân trang tìm kiếm, thumbnails tài khoản, placeholder khi danh sách trống.

# 7. TRẠNG THÁI DỰ ÁN & BACKLOG (STATE & TODO)

## Hoàn thành (Done)

- [x] Hệ thống toàn vẹn dữ liệu (Cascade Delete & Reassignment).
- [x] Cơ chế bảo vệ Safety Shield cho Views.
- [x] Chính sách chỉnh sửa nội dung bảo mật (Author Policy).
- [x] Nâng cấp Media: Upload 10MB + Image Responsive.
- [x] Phân trang trang chủ, trang đã lưu, trang tìm kiếm.
- [x] Hệ thống Toast thông báo tập trung.
- [x] Audit toàn bộ hệ thống & Fix code nhân danh tính chuyên nghiệp.
- [x] Việt hóa 100% giao tiếp và hướng dẫn.

## Đang tiến hành (In Progress)

- [ ] (Trống)

## Cần làm (TODO/Backlog)

- [x] Bàn giao hệ thống và đồng bộ tài liệu (Done).
