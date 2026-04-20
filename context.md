# 1. TỔNG QUAN DỰ ÁN (PROJECT META)

- **Tên dự án:** TrangTin
- **Mục tiêu cốt lõi:** Website trang tin tức cho phép người dùng đăng bài, bình luận và quản trị viên kiểm duyệt nội dung.
- **Nền tảng đích:** Web Application (Node.js/Express)

# 2. TECH STACK (CÔNG NGHỆ SỬ DỤNG)

- **Ngôn ngữ chính:** JavaScript (Node.js v14+)
- **Frameworks/Libraries:** Express.js 5.2.1, Mongoose 9.2.4 (MongoDB), EJS 5.0.1 (Template Engine), bcryptjs 3.0.3 (Auth), multer 2.1.1 (Upload), express-session 1.19.0, connect-mongo 6.0.0 (Session Store), dotenv 17.4.1 (Biến môi trường).
- **Database:** MongoDB Atlas.
- **Khác:** CKEditor 4.22.1 (soạn thảo bài viết), Bootstrap 5.1.3 (public pages via `app.css`) / 5.3.3 CDN (admin pages), Bootstrap Icons 1.8.1 (public) / 1.11.3 (admin), jQuery 3.7.1 (admin).

# 3. KIẾN TRÚC & CẤU TRÚC THƯ MỤC (ARCHITECTURE & STRUCTURE)

- **Mô hình kiến trúc:** MVC (Model-View-Controller).
- **Cấu trúc thư mục cốt lõi:**
  ```text
  /models               # Định nghĩa Schema MongoDB
    taikhoan.js            # TaiKhoan (HoVaTen, Email, HinhAnh, TenDangNhap, MatKhau, QuyenHan, KichHoat, BaiVietDaLuu)
    baiviet.js             # BaiViet (ChuDe, TaiKhoan, TieuDe, TomTat, NoiDung, NgayDang, LuotXem, KiemDuyet)
    binhluan.js            # BinhLuan (BaiViet, TaiKhoan, NoiDung, NgayBinhLuan, KiemDuyet, BinhLuanCha)
    chude.js               # ChuDe (TenChuDe)
  /routers              # Xử lý Route và Business Logic
    auth.js                # Đăng ký, Đăng nhập, Đăng xuất, Trang quản trị (Dashboard)
    index.js               # Trang chủ, Bài viết theo chuyên mục, Chi tiết bài viết, Bình luận, Bookmark, Đã lưu, Liên hệ, Chính sách, Tìm kiếm, Upload CKEditor
    baiviet.js             # CRUD bài viết (Admin + User), Duyệt bài, Bài viết của tôi
    chude.js               # CRUD chủ đề (Admin only)
    taikhoan.js            # CRUD tài khoản (Admin), Hồ sơ cá nhân (User)
    binhluan.js            # Danh sách, Duyệt, Xóa bình luận (Admin only)
  /modules              # Các hàm tiện ích và Middleware
    middlewares.js         # isAuth (kiểm tra đăng nhập), isAdmin (kiểm tra quyền admin)
    upload.js              # Multer config (diskStorage, giới hạn 10MB)
    firstimage.js          # Trích xuất ảnh đầu tiên từ nội dung HTML bài viết
  /views                # Giao diện EJS (28 files)
    navbar.ejs             # Navbar trang admin (Bootstrap 5.3.3)
    navbar_public.ejs      # Navbar trang public (chuyên mục dropdown, avatar user, tìm kiếm)
    footer.ejs             # Footer trang admin (bản quyền)
    footer_public.ejs      # Footer trang public (links + Toast include)
    toast.ejs              # Component thông báo Toast (success/error, auto-hide 4s)
    javascript.ejs         # JS chung admin (jQuery, Bootstrap bundle, form validation)
    index.ejs              # Trang chủ (phân trang 12 bài/trang, xem nhiều nhất)
    baiviet_chitiet.ejs    # Chi tiết bài viết (bình luận 2 cấp, bài viết liên quan, bookmark, responsive img)
    baiviet_chude.ejs      # Bài viết theo chuyên mục (phân trang động)
    baiviet_daluu.ejs      # Bài viết đã lưu (phân trang)
    baiviet_cuatoi.ejs     # Bài viết của tôi
    baiviet.ejs            # Quản lý bài viết (Admin)
    baiviet_them.ejs       # Form đăng bài (CKEditor)
    baiviet_sua.ejs        # Form sửa bài (CKEditor, hỗ trợ mode=admin)
    chude.ejs              # Quản lý chủ đề (Admin)
    chude_them.ejs         # Form thêm chủ đề
    chude_sua.ejs          # Form sửa chủ đề
    taikhoan.ejs           # Quản lý tài khoản (Admin, thumbnail avatar)
    taikhoan_them.ejs      # Form thêm tài khoản
    taikhoan_sua.ejs       # Form sửa tài khoản (chặn tự đổi quyền/khóa chính mình)
    taikhoan_hoso.ejs      # Hồ sơ cá nhân
    binhluan.ejs           # Quản lý bình luận (Admin, toggle duyệt/ẩn)
    dangnhap.ejs           # Trang đăng nhập
    dangky.ejs             # Trang đăng ký
    admin.ejs              # Dashboard (thống kê Chủ đề, Bài viết, Tài khoản)
    timkiem.ejs            # Kết quả tìm kiếm (phân trang)
    lienhe.ejs             # Trang liên hệ
    chinhsach.ejs          # Trang chính sách riêng tư
  /public               # Tài nguyên tĩnh
    /css/app.css           # Bootstrap 5.1.3 minified + CSS custom + Sticky Footer (Flexbox)
    /js/app.js             # JS chung public (timeago, Bootstrap bundle)
    /js/weather.js         # Widget thời tiết + đồng hồ (dùng ở 7 trang public)
    /js/config.js          # CKEditor custom config
    /images/uploads/       # Thư mục upload ảnh người dùng
    /images/noimage.png    # Ảnh mặc định khi bài viết không có ảnh
  index.js              # Điểm khởi đầu ứng dụng (Express setup, DB connect, Session, Toast middleware, Global Error Handler)
  .env                  # Biến môi trường (MONGO_URI) - KHÔNG push lên Git
  package.json          # Dependencies & Scripts (start, dev)
  ```

# 4. QUY CHUẨN MÃ NGUỒN (CODING CONVENTIONS)

- **Naming Convention:**
  - Models: PascalCase (e.g., `TaiKhoan`, `BaiViet`).
  - Biến/Hàm: camelCase hoặc Tiếng Việt không dấu tùy ngữ cảnh cũ.
- **Error Handling:** Global Error Handler (Express 5 auto-catch async errors) + try/catch cho các thao tác database quan trọng. Thông báo lỗi qua `req.session.error`, thành công qua `req.session.success`, hiển thị tức thì qua hệ thống **Bootstrap Toast** (`toastError`/`toastSuccess` trong `res.locals`). Đặc biệt: Xử lý lỗi `LIMIT_FILE_SIZE` (10MB) của Multer tập trung tại `index.js`, trả về JSON cho CKEditor `/upload`.
- **Session Variables:** `MaNguoiDung`, `HoVaTen`, `QuyenHan`, `HinhAnh`, `DaXem` (mảng ID bài viết đã xem để chống đếm lượt xem lặp).
- **Security:**
  - Mã hóa mật khẩu bằng bcrypt.
  - Middleware `isAuth` và `isAdmin` bảo vệ route nhạy cảm. `isAdmin` redirect về `/` kèm Toast lỗi.
  - Chống IDOR: kiểm tra sở hữu bài viết trước khi sửa/xóa. **Tác giả chỉ được sửa bài khi chưa duyệt.** Admin có quyền `?mode=admin` để ghi đè.
  - Chống ReDoS: escape regex trước khi dùng `RegExp` cho tìm kiếm.
  - HTTP Method Safety: các route xóa/duyệt dùng POST.
  - Chặn xem bài chưa duyệt: Chỉ Admin hoặc Tác giả mới xem được bài ở trạng thái chờ duyệt.

# 5. NGHIỆP VỤ & THỰC THỂ CHÍNH (DOMAIN & CORE ENTITIES)

- **Các Model cốt lõi:**
  - `TaiKhoan`: HoVaTen, Email, HinhAnh, TenDangNhap (unique), MatKhau (bcrypt hashed), QuyenHan (user/admin), KichHoat (0/1), BaiVietDaLuu (array of refs). **Không cho tự đổi quyền/khóa chính mình.**
  - `ChuDe`: TenChuDe (unique, required). **Chặn xóa nếu còn bài viết liên quan.** Kiểm tra trùng tên khi thêm/sửa.
  - `BaiViet`: ChuDe (ref), TaiKhoan (ref), TieuDe, TomTat, NoiDung, NgayDang, LuotXem, KiemDuyet (0/1). **Xóa bài tự động dọn dẹp bình luận và bookmark.**
  - `BinhLuan`: BaiViet (ref), TaiKhoan (ref), NoiDung, NgayBinhLuan, KiemDuyet (0/1 — mặc định 1), BinhLuanCha (ref). **Xóa bình luận gốc tự động xóa toàn bộ phản hồi con.**

# 6. LUỒNG HOẠT ĐỘNG CHÍNH (CORE FLOWS)

## Flow 1: Đăng ký & Đăng nhập

- **Đăng ký:** Upload ảnh đại diện (multer), kiểm tra mật khẩu xác nhận, hash bcrypt, kiểm tra trùng TenDangNhap + trùng Email (unique constraint + findOne check).
- **Đăng nhập:** Kiểm tra TenDangNhap → so sánh bcrypt → kiểm tra KichHoat → tạo session (MaNguoiDung, HoVaTen, QuyenHan, HinhAnh).
- **Đăng xuất:** Xóa các biến session, redirect về trang chủ.
- **Tài khoản mồ côi:** Khi xóa tài khoản, tất cả bài viết/bình luận của họ được **Chuyển nhượng (Reassign)** về cho Admin thực hiện lệnh xóa, đồng thời xóa ảnh đại diện trên server.

## Flow 2: Quản lý bài viết (Tác giả)

- Đăng bài → chờ duyệt. Sửa bài: Chỉ được phép sửa khi bài ở trạng thái chờ duyệt. Một khi bài đã đăng công khai, chỉ Admin mới có quyền sửa đổi.
- **Media:** Dung lượng tải lên tối đa **10MB**. Ảnh trong bài viết tự động thích ứng (Responsive) 100% chiều rộng khung kèm đổ bóng.
- **Lượt xem:** Chống đếm lặp bằng `req.session.DaXem` (mảng ID trong session).
- **Bookmark:** Người dùng có thể lưu/bỏ lưu bài viết. Danh sách đã lưu có phân trang.
- **Bài viết liên quan:** Hiển thị tối đa 4 bài cùng chủ đề (loại trừ bài hiện tại).

## Flow 3: Kiểm duyệt & Quản trị (Admin)

- Quản lý toàn bộ danh sách Bài viết, Chủ đề, Tài khoản, Bình luận.
- Chế độ ghi đè: Sử dụng query parameter `?mode=admin` để chỉnh sửa mọi bài viết bất kể tình trạng kiểm duyệt.
- Dashboard: Hiển thị thống kê tổng Chủ đề, Bài viết, Tài khoản.
- Duyệt bài/bình luận: Toggle duyệt/bỏ duyệt (1 ↔ 0).
- Quản lý giao diện: Phân trang, thumbnails tài khoản, placeholder khi danh sách trống.

## Flow 4: Trang chủ & Public

- **Phân trang Trang chủ:** 12 bài/trang, sắp xếp mới nhất, chỉ hiển thị bài đã duyệt.
- **Phân trang Chuyên mục:** 12 bài/trang theo chủ đề, phân trang động.
- **Phân trang Tìm kiếm:** 10 kết quả/trang, tìm theo TieuDe hoặc TomTat (case-insensitive).
- **Phân trang Đã lưu:** 12 bài/trang, sắp xếp bài mới lưu lên đầu.
- **Sidebar:** Khung Giới thiệu, Thẻ chuyên mục, Top 3 xem nhiều nhất.

# 7. DANH SÁCH ROUTE ĐẦY ĐỦ

| Method | URL                    | Middleware | Mô tả                                              |
| ------ | ---------------------- | ---------- | -------------------------------------------------- |
| GET    | `/`                    | —          | Trang chủ (phân trang)                             |
| GET    | `/baiviet/chude/:id`   | —          | Bài viết theo chuyên mục (phân trang)              |
| GET    | `/baiviet/chitiet/:id` | —          | Chi tiết bài viết (bình luận, liên quan, bookmark) |
| POST   | `/binhluan/:id`        | isAuth     | Gửi bình luận (hỗ trợ reply)                       |
| POST   | `/baiviet/luu/:id`     | isAuth     | Lưu/bỏ lưu bài viết                                |
| GET    | `/baiviet/daluu`       | isAuth     | Danh sách bài viết đã lưu (phân trang)             |
| GET    | `/lienhe`              | —          | Trang liên hệ                                      |
| GET    | `/chinhsach`           | —          | Chính sách riêng tư                                |
| GET    | `/timkiem`             | —          | Tìm kiếm bài viết (phân trang)                     |
| POST   | `/upload`              | isAuth     | Upload ảnh từ CKEditor                             |
| GET    | `/dangky`              | —          | Form đăng ký                                       |
| POST   | `/dangky`              | —          | Xử lý đăng ký                                      |
| GET    | `/dangnhap`            | —          | Form đăng nhập                                     |
| POST   | `/dangnhap`            | —          | Xử lý đăng nhập                                    |
| GET    | `/dangxuat`            | —          | Đăng xuất                                          |
| GET    | `/admin`               | isAdmin    | Dashboard quản trị                                 |
| GET    | `/baiviet`             | isAdmin    | Danh sách bài viết (Admin)                         |
| GET    | `/baiviet/them`        | isAuth     | Form đăng bài                                      |
| POST   | `/baiviet/them`        | isAuth     | Xử lý đăng bài                                     |
| GET    | `/baiviet/sua/:id`     | isAuth     | Form sửa bài                                       |
| POST   | `/baiviet/sua/:id`     | isAuth     | Xử lý sửa bài                                      |
| POST   | `/baiviet/xoa/:id`     | isAuth     | Xóa bài viết (cascade)                             |
| POST   | `/baiviet/duyet/:id`   | isAdmin    | Toggle duyệt bài                                   |
| GET    | `/baiviet/cuatoi`      | isAuth     | Bài viết của tôi                                   |
| GET    | `/chude`               | isAdmin    | Danh sách chủ đề                                   |
| GET    | `/chude/them`          | isAdmin    | Form thêm chủ đề                                   |
| POST   | `/chude/them`          | isAdmin    | Xử lý thêm chủ đề                                  |
| GET    | `/chude/sua/:id`       | isAdmin    | Form sửa chủ đề                                    |
| POST   | `/chude/sua/:id`       | isAdmin    | Xử lý sửa chủ đề                                   |
| POST   | `/chude/xoa/:id`       | isAdmin    | Xóa chủ đề (chặn nếu còn bài viết)                 |
| GET    | `/taikhoan`            | isAdmin    | Danh sách tài khoản                                |
| GET    | `/taikhoan/them`       | isAdmin    | Form thêm tài khoản                                |
| POST   | `/taikhoan/them`       | isAdmin    | Xử lý thêm tài khoản                               |
| GET    | `/taikhoan/sua/:id`    | isAdmin    | Form sửa tài khoản                                 |
| POST   | `/taikhoan/sua/:id`    | isAdmin    | Xử lý sửa tài khoản                                |
| POST   | `/taikhoan/xoa/:id`    | isAdmin    | Xóa tài khoản (reassign)                           |
| GET    | `/taikhoan/hoso`       | isAuth     | Hồ sơ cá nhân                                      |
| POST   | `/taikhoan/hoso`       | isAuth     | Cập nhật hồ sơ                                     |
| GET    | `/binhluan`            | isAdmin    | Danh sách bình luận                                |
| POST   | `/binhluan/duyet/:id`  | isAdmin    | Toggle duyệt bình luận                             |
| POST   | `/binhluan/xoa/:id`    | isAdmin    | Xóa bình luận (cascade replies)                    |

# 8. TRẠNG THÁI DỰ ÁN & BACKLOG (STATE & TODO)

## Hoàn thành (Done)

- [x] Hệ thống toàn vẹn dữ liệu (Cascade Delete & Reassignment).
- [x] Cơ chế bảo vệ Safety Shield cho Views.
- [x] Chính sách chỉnh sửa nội dung bảo mật (Author Policy).
- [x] Nâng cấp Media: Upload 10MB + Image Responsive.
- [x] Phân trang trang chủ, trang đã lưu, trang tìm kiếm, trang chuyên mục.
- [x] Hệ thống Toast thông báo tập trung.
- [x] Bình luận đa cấp (cha-con) + bài viết liên quan + bookmark.
- [x] Chống đếm lượt xem lặp (session-based).
- [x] Audit toàn bộ hệ thống lần 1 & lần 2: Fix route 404, phân trang chuyên mục, dead CSS, biến legacy, HTML/code thừa.
- [x] Việt hóa 100% giao tiếp và hướng dẫn.
- [x] Bàn giao hệ thống và đồng bộ tài liệu.

## Đang tiến hành (In Progress)

- (Trống)

## Cần làm (TODO/Backlog)

- (Trống)
