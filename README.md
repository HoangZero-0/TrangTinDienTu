# 📰 iNews — Trang Tin Điện Tử (Node.js & MongoDB)

**iNews** là một hệ thống Quản trị Nội dung (CMS) tin tức hiện đại, được thiết kế tập trung vào tính bảo mật, hiệu năng và trải nghiệm người dùng tối ưu. Hệ thống cho phép người dùng đăng ký, đóng góp nội dung, tương tác qua bình luận và phân quyền quản trị chặt chẽ.

---

## 🏗️ Kiến trúc & Công nghệ (Tech Stack)

Hệ thống được xây dựng trên mô hình **MVC (Model-View-Controller)** truyền thống nhưng được tối ưu hóa với các công nghệ hiện đại nhất:

| Thành phần    | Công nghệ         | Chi tiết                                         |
| :------------ | :---------------- | :----------------------------------------------- |
| **Backend**   | **Node.js 14+**   | Express.js Framework (v5.2.1)                    |
| **Database**  | **MongoDB Atlas** | NoSQL Cloud Database (Mongoose v9.2.4)           |
| **Giao diện** | **EJS Template**  | Embedded JavaScript (v5.0.1)                     |
| **Lưu trữ**   | **Multer**        | Xử lý upload ảnh (Giới hạn 10MB)                 |
| **Bảo mật**   | **Bcryptjs**      | Mã hóa mật khẩu 1 chiều (v3.0.3)                 |
| **Session**   | **Connect-Mongo** | Lưu trữ session bền bỉ tại MongoDB (v6.0.0)      |
| **Soạn thảo** | **CKEditor 4**    | Trình soạn thảo văn bản giàu tính năng (v4.22.1) |
| **Frontend**  | **Bootstrap 5**   | Public (v5.1.3) & Admin (v5.3.3)                 |

---

## ✨ Các tính năng cốt lõi

### 1. 📂 Quản lý Nội dung thông minh

- **Quy trình Kiểm duyệt:** Bài viết sau khi đăng sẽ ở trạng thái "Chờ duyệt" (Chỉ Admin và Tác giả mới xem được). Một khi đã Duyệt, bài viết sẽ công khai toàn trang.
- **Trình soạn thảo CKEditor:** Tích hợp bộ công cụ soạn thảo chuyên nghiệp, hỗ trợ upload ảnh trực tiếp vào nội dung bài viết.
- **Tự động trích xuất:** Hệ thống tự động tìm và trích xuất hình ảnh đầu tiên trong nội dung bài viết để làm ảnh đại diện (Thumbnail) nếu người dùng không thiết lập.

### 2. 👥 Quản lý Người dùng & Phân quyền

- **Hệ thống Auth:** Đăng ký, Đăng nhập với cơ chế bảo mật mật khẩu tối đa.
- **Quyền hạn (Role-based):**
  - `User`: Đăng bài, bình luận, lưu bài viết yêu thích (Bookmark), quản lý bài viết cá nhân.
  - `Admin`: Toàn quyền quản trị Bài viết, Chủ đề, Tài khoản và Bình luận.
- **Hồ sơ cá nhân:** Cập nhật thông tin, thay đổi ảnh đại diện và theo dõi hoạt động cá nhân.

### 3. 💬 Tương tác & Trải nghiệm (UX)

- **Bình luận đa cấp:** Hỗ trợ Reply (Phản hồi) phân cấp 2 tầng, giúp các cuộc thảo luận trở nên minh bạch.
- **Hệ thống Bookmark:** Lưu trữ những bài viết quan tâm vào danh sách riêng tư với tính năng phân trang.
- **Thống kê Lượt xem:** Cơ chế đếm View thông minh, chống tăng ảo (chống spam F5) dựa trên Session.
- **Widget Thời gian & Thời tiết:** Tích hợp dữ liệu thời tiết thực tế từ OpenWeatherMap và giờ vệ tinh chính xác 100%.

### 4. 🔦 Tìm kiếm & Lọc dữ liệu

- **Server-side Search:** Tìm kiếm bài viết công khai theo tiêu đề và tóm tắt với cơ chế phân trang.
- **Admin Quick Filter:** Hệ thống lọc dữ liệu nhanh tại các bảng quản lý (Dùng jQuery + Manual Trigger - Click/Enter) giúp tiết kiệm tài nguyên CPU.

---

## 🔒 Cơ chế Bảo mật & Toàn vẹn (Advanced)

Hệ thống được thiết lập các "Lớp bảo vệ" (Security Layers) mạnh mẽ:

- **IDOR Protection:** Chặn tuyệt đối việc chỉnh sửa hoặc xóa bài viết/tài khoản thông qua việc thay đổi ID trên URL. Hệ thống luôn kiểm tra quyền sở hữu bài viết trước khi thực thi lệnh.
- **Author Policy:** Tác giả chỉ được sửa bài viết khi nó chưa được duyệt. Một khi đã công khai, chỉ Admin mới có quyền biên tập lại nội dung.
- **Cascade Delete:** Khi xóa bài viết, hệ thống tự động xóa sạch các bình luận liên quan và gỡ bỏ bài viết khỏi danh sách Bookmark của toàn bộ người dùng.
- **Account Reassign:** Khi xóa một tài khoản, các bài viết của họ sẽ không bị mất (mồ côi) mà được chuyển quyền sở hữu về tài khoản Admin để bảo toàn luồng thông tin hệ thống.
- **Session Sync Middleware:** Middleware tự động đồng bộ hóa thông tin người dùng từ Database vào Session ở mỗi lượt Request, đảm bảo trạng thái tài khoản (Khóa/Mở, Quyền hạn) luôn cập nhật tức thì.

---

## ⚙️ Cài đặt & Vận hành

### 1. Yêu cầu bộ tiền xử lý

- **Node.js** (Phiên bản khuyến nghị: v18.x trở lên).
- **MongoDB** (Local instance hoặc MongoDB Atlas).

### 2. Các bước thiết lập

1. **Clone repository:**
   ```bash
   git clone <url_code>
   ```
2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```
3. **Cấu hình môi trường (.env):**
   Tạo file `.env` tại thư mục gốc với các biến:
   ```env
   MONGO_URI=mongodb+srv://... (Link kết nối MongoDB)
   PORT=3000
   ```
4. **Chạy ứng dụng:**
   - Phát triển: `npm run dev` (Sử dụng Nodemon).
   - Vận hành: `npm start`.

### 3. Truy cập

Mở trình duyệt và truy cập: [http://127.0.0.1:3000](http://127.0.0.1:3000)

---

## 👨‍💻 Thông tin Tác giả

- ✍️ **Nguyễn Hoàng Thức** & **Lê Nhật Quang**
- ☁️ Được triển khai và vận hành ổn định trên nền tảng **Render.com**.
