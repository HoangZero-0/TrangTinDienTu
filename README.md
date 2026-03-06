# Dự án TrangTin_v3.1

Đây là một dự án website trang tin tức được xây dựng trên nền tảng Node.js. 

## Công nghệ sử dụng
* **Backend:** Node.js, Express.js
* **Cơ sở dữ liệu:** MongoDB
* **Template Engine:** EJS
* **Bảo mật:** bcrypt (mã hóa mật khẩu)

## Yêu cầu hệ thống
Để chạy được dự án này trên máy tính, bạn cần cài đặt sẵn:
* Node.js (phiên bản 14.x trở lên)
* MongoDB (đang chạy local hoặc dùng MongoDB Atlas)

## Hướng dẫn cài đặt và chạy dự án

**Bước 1: Tải mã nguồn về máy**
Mở Terminal và chạy lệnh sau để clone project:
git clone https://github.com/HoangZero-0/TrangTin_v3.1.git

**Bước 2: Di chuyển vào thư mục dự án**
cd trangtin_v3.1

**Bước 3: Cài đặt các thư viện (Dependencies)**
Vì thư mục `node_modules` đã được bỏ qua khi đẩy lên GitHub để giảm dung lượng, bạn cần chạy lệnh này để tải lại toàn bộ thư viện cần thiết:
npm install

**Bước 4: Chạy ứng dụng**
Khởi động server bằng lệnh:
npm start

Trang web sẽ hoạt động tại địa chỉ: `http://localhost:3000`.

## Tác giả
* **HoangZero-0** - [Link GitHub](https://github.com/HoangZero-0)