# 1. TỔNG QUAN DỰ ÁN (PROJECT META)

- **Tên dự án:** TrangTin (iNews)
- **Mục tiêu cốt lõi:** Hệ thống CMS tin tức chuyên nghiệp, hỗ trợ đa người dùng, tương tác bình luận và quản trị nội dung an toàn.
- **Nền tảng đích:** Web Application (Node.js/Express)
- **Hosting:** Render.com
- **Database:** MongoDB Atlas (NoSQL)

# 2. TECH STACK (CÔNG NGHỆ SỬ DỤNG)

- **Ngôn ngữ:** JavaScript (Node.js v14+)
- **Backend:** Express.js 5.2.1 (Sử dụng các tính năng mới nhất của Express 5 như auto-catch async errors).
- **Database:** Mongoose 9.2.4 (ODM cho MongoDB).
- **Template Engine:** EJS 5.0.1 (Giao diện phía Server).
- **Auth & Security:**
  - `bcryptjs` 3.0.3 (Mã hóa mật khẩu).
  - `express-session` 1.19.0 (Quản lý phiên làm việc).
  - `connect-mongo` 6.0.0 (Lưu trữ session bền bỉ trong MongoDB).
- **Media & Upload:**
  - `multer` 2.1.1 (Xử lý file upload, giới hạn 10MB).
  - `firstimage.js` (Module tự động trích xuất ảnh từ nội dung HTML).
- **Frontend Tools:**
  - `Bootstrap 5.1.3` (Public) và `5.3.3` (Admin).
  - `Bootstrap Icons` 1.11.3.
  - `jQuery 3.7.1` (Sử dụng cho Quick Filter tại Admin).
  - `CKEditor 4.22.1` (Trình soạn thảo văn bản cho bài viết).
- **External APIs:**
  - `OpenWeatherMap`: Dữ liệu thời tiết.
  - `WorldTimeAPI`: Đồng bộ thời gian thực.

# 3. KIẾN TRÚC & CẤU TRÚC THƯ MỤC (ARCHITECTURE & STRUCTURE)

- **Mô hình kiến trúc:** MVC (Model-View-Controller).
- **Cấu trúc thư mục:**
  ```text
  /models               # Schema định nghĩa dữ liệu (Mongoose)
    baiviet.js            # Bài viết (Tiêu đề, Tóm tắt, Nội dung, Lượt xem, Kiểm duyệt...)
    binhluan.js           # Bình luận (Hỗ trợ phân cấp BinhLuanCha)
    chude.js              # Chủ đề (Danh mục tin tức)
    taikhoan.js           # Tài khoản (Thông tin, Quyền, Bookmark)
  /routers              # Điều hướng và xử lý Logic nghiệp vụ
    index.js              # Trang chủ và các route công khai (Tìm kiếm, Bookmark, Upload)
    auth.js               # Xác thực tài khoản và Dashboard Admin
    baiviet.js            # Nghiệp vụ Bài viết (Thêm, Sửa, Xóa, Duyệt)
    chude.js              # Quản lý Chủ đề (Admin)
    taikhoan.js           # Quản lý Tài khoản (Admin & Cá nhân)
    binhluan.js           # Quản lý Bình luận (Admin)
  /modules              # Tiện ích bổ trợ (Utilities)
    middlewares.js        # isAuth, isAdmin (Lớp bảo vệ Route)
    upload.js             # Cấu hình Multer (Storage & Filter)
    firstimage.js         # Logic trích xuất ảnh tự động
  /views                # Giao diện (28 file EJS)
    partials/             # Các thành phần dùng chung (Header, Footer, Toast)
  /public               # Tài nguyên tĩnh (CSS, JS, Images, Uploads)
  index.js              # Điểm khởi đầu phối hợp toàn bộ Middleware và Route
  ```

# 4. CHI TIẾT CÁC THỰC THỂ (DOMAIN MODELS)

- **TaiKhoan (User Account):**
  - `HoVaTen`: Tên đầy đủ của người dùng.
  - `Email`: Địa chỉ liên lạc.
  - `HinhAnh`: Đường dẫn ảnh đại diện (avatar).
  - `TenDangNhap`: Tên định danh duy nhất (Unique).
  - `MatKhau`: Chuỗi băm Bcrypt.
  - `QuyenHan`: Quyền làm việc (`user`, `admin`).
  - `KichHoat`: Trạng thái hoạt động (1: Hoạt động, 0: Bị khóa).
  - `BaiVietDaLuu`: Mảng các tham chiếu ObjectId đến bài viết (Bookmark).
- **BaiViet (Post):**
  - `ChuDe`: Tham chiếu đến danh mục (`ChuDe`).
  - `TaiKhoan`: Tham chiếu đến người đăng.
  - `TieuDe`, `TomTat`, `NoiDung`: Thành phần nội dung chính.
  - `NgayDang`: Thời gian khởi tạo.
  - `LuotXem`: Số lần truy cập (Session-based counter).
  - `KiemDuyet`: Trạng thái (1: Đã duyệt/Công khai, 0: Chờ duyệt).
- **BinhLuan (Comment):**
  - `BaiViet`: Thuộc bài viết nào.
  - `TaiKhoan`: Ai bình luận.
  - `NoiDung`: Nội dung văn bản.
  - `NgayBinhLuan`: Thời gian bình luận.
  - `KiemDuyet`: Mặc định 1 (Có thể ẩn bởi Admin).
  - `BinhLuanCha`: Tham chiếu đến bình luận gốc (Hỗ trợ phân cấp cây).
- **ChuDe (Category):**
  - `TenChuDe`: Tên danh mục (Duy nhất, không phân biệt hoa thường).

# 5. CƠ CHẾ BẢO MẬT & NGHIỆP VỤ NÂNG CAO

- **IDOR Security:** Luôn kiểm tra quyền sở hữu (Ownership) trước khi cho phép Sửa/Xóa. User không thể thay đổi dữ liệu của người khác bằng cách thay đổi ID trên URL.
- **Author Policy:** Tác giả chỉ được sửa bài khi trạng thái là `Chờ duyệt`. Một khi đã công khai, chỉ Admin mới có quyền biên tập lại nội dung.
- **Session Security:**
  - Dùng `connect-mongo` để duy trì trạng thái đăng nhập lâu dài (30 ngày).
  - Middleware đồng bộ tại `index.js` kiểm tra và cập nhật biến `res.locals.session` ở mỗi request.
- **Search Optimization:** Cơ chế tìm kiếm nhanh (Filter) dùng jQuery, kích hoạt thủ công (`btnSearch` hoặc phím `Enter`) để tránh quá tải trình duyệt.
- **Cascade Ops:**
  - Xóa Bài viết -> Xóa tất cả Bình luận thuộc về nó.
  - Xóa Bài viết -> Gỡ bỏ khỏi toàn bộ danh sách `BaiVietDaLuu` của User.

# 6. DANH SÁCH ROUTE CHI TIẾT

| Method   | URL                    | Quyền hạn | Mô tả nghiệp vụ                       |
| :------- | :--------------------- | :-------- | :------------------------------------ |
| **GET**  | `/`                    | Công khai | Trang chủ (Phân trang 12 bài/trang)   |
| **GET**  | `/baiviet/chude/:id`   | Công khai | Lọc bài viết theo danh mục            |
| **GET**  | `/baiviet/chitiet/:id` | Công khai | Xem nội dung + Gợi ý bài liên quan    |
| **POST** | `/binhluan/:id`        | isAuth    | Gửi bình luận / Phản hồi              |
| **POST** | `/baiviet/luu/:id`     | isAuth    | Toggle lưu bài viết (Bookmark)        |
| **GET**  | `/timkiem`             | Công khai | Tìm kiếm bài viết (Regex safe)        |
| **GET**  | `/admin`               | isAdmin   | Bảng điều khiển thống kê tổng quan    |
| **GET**  | `/baiviet/them`        | isAuth    | Form soạn thảo (CKEditor)             |
| **POST** | `/baiviet/sua/:id`     | isAuth    | Xử lý cập nhật (Kiểm tra ?mode=admin) |
| **POST** | `/baiviet/duyet/:id`   | isAdmin   | Chuyển trạng thái 0 <-> 1             |

# 7. TRẠNG THÁI DỰ ÁN & BACKLOG

## Hoàn thành (Done)

- [x] Hệ thống Core CMS (Thêm/Sửa/Xóa/Duyệt).
- [x] Cơ chế bảo mật Middleware bậc cao (Auth, Admin, Ownership).
- [x] Xử lý Media (Upload, Trích xuất ảnh, Ảnh responsive 100%).
- [x] Giao diện Double-Fixed Header (Thời tiết + Navbar).
- [x] Quick Filter dữ liệu tại Admin (Tối ưu hiệu năng).
- [x] Global Error Handler & Toast Notification.
- [x] Việt hóa toàn bộ giao diện và tài liệu hướng dẫn.

## Cần làm (TODO/Backlog)

- [ ] Chuyển đổi sang kiến trúc Microservices nếu dữ liệu lớn.
- [ ] Tích hợp cơ chế thông báo Notification thời gian thực.
