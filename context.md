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
- **Error Handling:** Global Error Handler (Express 5 auto-catch async errors) + try/catch cho các thao tác database quan trọng. Thông báo lỗi qua `req.session.error`, thành công qua `req.session.success`. Đặc biệt: Xử lý lỗi `LIMIT_FILE_SIZE` của Multer tập trung tại `index.js`.
- **Security:**
  - Mã hóa mật khẩu bằng bcrypt.
  - Middleware `isAuth` và `isAdmin` bảo vệ route nhạy cảm.
  - Chống IDOR: kiểm tra sở hữu bài viết trước khi sửa/xóa.
  - Chống ReDoS: escape regex trước khi dùng `RegExp` cho tìm kiếm.
  - HTTP Method Safety: các route xóa/duyệt dùng POST (không phải GET).
  - MongoDB URI lưu trong `.env` (dotenv), `.gitignore` đã cấu hình.
  - Kiểm tra xác nhận mật khẩu khi đăng ký.

# 5. NGHIỆP VỤ & THỰC THỂ CHÍNH (DOMAIN & CORE ENTITIES)

- **Các Model cốt lõi:**
  - `TaiKhoan`: HoVaTen, Email, HinhAnh, TenDangNhap (unique), MatKhau (bcrypt hashed), QuyenHan (user/admin), KichHoat (0/1), BaiVietDaLuu (array of refs).
  - `ChuDe`: TenChuDe (unique, required). Không thể xóa nếu còn bài viết liên quan.
  - `BaiViet`: ChuDe (ref), TaiKhoan (ref), TieuDe, TomTat, NoiDung, NgayDang, LuotXem, KiemDuyet (0/1).
  - `BinhLuan`: BaiViet (ref), TaiKhoan (ref), NoiDung, NgayBinhLuan, KiemDuyet (0/1), BinhLuanCha (ref - dùng cho trả lời bình luận).

# 6. LUỒNG HOẠT ĐỘNG CHÍNH (CORE FLOWS)

## Flow 1: Đăng ký & Đăng nhập

- **Đăng ký:** Upload ảnh đại diện (multer), kiểm tra mật khẩu xác nhận, hash bcrypt, kiểm tra trùng TenDangNhap (unique index).
- **Đăng nhập:** Xác thực bcrypt, kiểm tra tài khoản bị khóa (KichHoat=0), lưu session (MaNguoiDung, HoVaTen, QuyenHan).
- **Đăng xuất:** Xóa session MaNguoiDung, HoVaTen, QuyenHan.
- **Files:** `routers/auth.js`, `views/dangky.ejs`, `views/dangnhap.ejs`.

## Flow 2: Quản lý bài viết (Tác giả)

- Đăng bài (chọn chủ đề, nhập tiêu đề/tóm tắt/nội dung CKEditor) → trạng thái chờ duyệt (KiemDuyet: 0).
- Sửa/Xóa bài viết của chính mình (kiểm tra IDOR).
- Xem danh sách "Bài viết của tôi".
- **Files:** `routers/baiviet.js`, `views/baiviet_them.ejs`, `views/baiviet_sua.ejs`, `views/baiviet_cuatoi.ejs`.

## Flow 3: Kiểm duyệt & Quản trị (Admin)

- Dashboard: thống kê số lượng chủ đề, bài viết, tài khoản.
- Duyệt/bỏ duyệt bài viết và bình luận (toggle KiemDuyet, POST method).
- CRUD chủ đề (kiểm tra bài viết liên quan trước khi xóa).
- CRUD tài khoản (khóa/mở, đổi quyền, xóa ảnh cũ khi upload mới).
- Xóa bài viết/bình luận (POST method, có confirm dialog).
- **Files:** `routers/baiviet.js`, `routers/binhluan.js`, `routers/chude.js`, `routers/taikhoan.js`, `routers/auth.js`.

## Flow 4: Hiển thị & Tương tác (Độc giả)

- **Trang chủ:** Tin mới nhất (phân trang 12 bài/trang), sidebar "Xem nhiều nhất" + "Thẻ chuyên mục".
- **Chi tiết bài viết:** Tăng lượt xem (session-based, tránh spam). Chặn xem bài chưa duyệt trừ admin/tác giả. Hiển thị 4 bài viết liên quan (cùng chủ đề). Cho phép lưu bài viết (Bookmark).
- **Bình luận:** Yêu cầu đăng nhập. Hỗ trợ bình luận hai cấp (gốc và trả lời). Phản hồi kế thừa trạng thái kiểm duyệt.
- **Bài viết đã lưu:** Xem danh sách bài viết độc giả đã lưu (route `/baiviet/daluu`, yêu cầu đăng nhập).
- **Tìm kiếm:** Escape regex chống ReDoS, hiển thị kết quả dạng card.
- **Chuyên mục:** Xem bài theo chủ đề, dropdown menu navbar.
- **Tin mới nhất:** API `/tinmoi`, hiển thị 50 bài mới nhất.
- **Trang tĩnh:** Liên hệ, Chính sách riêng tư.
- **Upload ảnh:** CKEditor upload qua `/upload` (multer).
- **Files:** `routers/index.js`, `views/index.ejs`, `views/baiviet_chitiet.ejs`, `views/baiviet_daluu.ejs`, `views/baiviet_chude.ejs`, `views/timkiem.ejs`, `views/tinmoinhat.ejs`, `views/lienhe.ejs`, `views/chinhsach.ejs`.

## Flow 5: Hồ sơ cá nhân

- Người dùng cập nhật HoVaTen, Email, HinhAnh, MatKhau. Giới hạn ảnh tối đa 2MB.
- Xóa ảnh cũ khi upload ảnh mới. Định dạng hiển thị đồng bộ qua class `.img-thumbnail-account` (100x100px, circle).
- **Files:** `routers/taikhoan.js` (GET/POST /hoso), `views/taikhoan_hoso.ejs`.

# 7. TRẠNG THÁI DỰ ÁN & BACKLOG (STATE & TODO)

## Hoàn thành (Done)

- [x] Cấu trúc Model và Database.
- [x] Hệ thống Đăng ký/Đăng nhập/Phân quyền.
- [x] Chức năng Đăng bài và Quản lý bài viết cá nhân.
- [x] Chức năng Quản lý (Admin): Duyệt bài, Chủ đề, Tài khoản.
- [x] Giao diện hiển thị, Tìm kiếm, Bình luận.
- [x] Loại bỏ phần Instagram trên giao diện người dùng.
- [x] Triển khai trang Liên hệ và Chính sách riêng tư.
- [x] Fix Bug: `require` → `required` trong ChuDe model.
- [x] Fix Bug: Regex firstImage khớp cả `<img>` và `<img/>`.
- [x] Fix Bug: Input HinhAnh đăng ký đổi sang `type="file"`.
- [x] Fix Bug: Kiểm tra xác nhận mật khẩu khi đăng ký.
- [x] Bảo mật: Escape regex chống ReDoS trong tìm kiếm.
- [x] Bảo mật: Đổi GET → POST cho route xóa/duyệt (4 routers + 5 views).
- [x] Bảo mật: MongoDB URI → `.env` + dotenv + `.gitignore`.
- [x] Logic: Kiểm tra bài viết liên quan trước khi xóa chủ đề.
- [x] Logic: Global Error Handler (Express 5 async error handling).
- [x] Logic: Null-safe check cho `bv.ChuDe` trong 7 views (phòng bài viết mồ côi).
- [x] UI: Xóa newsletter giả khỏi 4 trang public.
- [x] Kiến trúc: Tách navbar public thành `navbar_public.ejs` (7 trang dùng chung).
- [x] Kiến trúc: Tách footer public thành `footer_public.ejs` (7 trang dùng chung).
- [x] UI: Đổi footer từ bg-dark sang tone #2c3e50 (navy đậm).
- [x] Tính năng: Trả lời bình luận (threaded comments) và Bài viết liên quan (related posts).
- [x] Tính năng: Lưu bài viết (Bookmark) + view `baiviet_daluu.ejs` + link navbar "Đã lưu".
- [x] UI: Sticky Footer (Flexbox) đảm bảo footer luôn ở dưới cùng trang.
- [x] Bảo mật & UI: Giới hạn upload ảnh 2MB (Multer) + Hiển thị ảnh đại diện đồng bộ (`.img-thumbnail-account`).
- [x] Giao diện: Thêm `accept="image/*"` cho tất cả các input file chọn ảnh.

## Đang tiến hành (In Progress)

- [ ] (Trống)

## Cần làm (TODO/Backlog)

- [ ] (Trống)
