require('dotenv').config();
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var path = require('path');

var indexRouter = require('./routers/index');
var authRouter = require('./routers/auth');
var chudeRouter = require('./routers/chude');
var taikhoanRouter = require('./routers/taikhoan');
var baivietRouter = require('./routers/baiviet');
var binhluanRouter = require('./routers/binhluan');

var uri = process.env.MONGO_URI || "mongodb://admin:admin123@ac-ey8c2sr-shard-00-01.em5yvyc.mongodb.net:27017/trangtin?ssl=true&authSource=admin";
mongoose.connect(uri)
    .then(() => console.log('Đã kết nối thành công tới MongoDB.'))
    .catch(err => console.log(err));

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));

var MongoStore = require('connect-mongo').MongoStore;
app.use(session({
	name: 'iNews',						// Tên session (tự chọn)
	secret: 'Mèo méo meo mèo meo',		// Khóa bảo vệ (tự chọn)
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({ mongoUrl: uri }),
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000// Hết hạn sau 30 ngày
	}
}));

app.use((req, res, next) => {
	// Chuyển biến session thành biến cục bộ
	res.locals.session = req.session;
	
	// Lấy thông báo (lỗi, thành công) của trang trước đó (nếu có)
	var err = req.session.error;
	var msg = req.session.success;
	
	// Xóa session sau khi đã truyền qua biến trung gian
	delete req.session.error;
	delete req.session.success;
	
	// Gán thông báo vào biến cục bộ cho Toast
	res.locals.toastError = err || '';
	res.locals.toastSuccess = msg || '';
	
	// Giữ biến message cũ cho tương thích ngược
	res.locals.message = '';
	if (err) res.locals.message = '<span class="text-danger">' + err + '</span>';
	if (msg) res.locals.message = '<span class="text-success">' + msg + '</span>';
	
	next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/chude', chudeRouter);
app.use('/taikhoan', taikhoanRouter);
app.use('/baiviet', baivietRouter);
app.use('/binhluan', binhluanRouter);

// Global Error Handler - Bắt tất cả lỗi từ async routes (Express 5)
app.use((err, req, res, next) => {
	var isUploadPath = req.path === '/upload';
	
	if (err.code === 'LIMIT_FILE_SIZE') {
		var errorMsg = 'Dung lượng file quá lớn, tối đa cho phép là 10MB.';
		if (isUploadPath) {
			return res.status(200).json({ uploaded: 0, error: { message: errorMsg } });
		}
		req.session.error = errorMsg;
		return res.redirect(req.get('Referrer') || '/');
	}
	
	console.error('[LỖI HỆ THỐNG]', err.message);
	
	if (isUploadPath) {
		return res.status(200).json({ uploaded: 0, error: { message: 'Lỗi upload: ' + err.message } });
	}
	
	req.session.error = 'Đã xảy ra lỗi hệ thống: ' + err.message;
	var backURL = req.get('Referrer') || '/';
	req.session.save(() => {
		res.redirect(backURL);
	});
});

app.listen(3000, () => {
	console.log('Server is running at http://127.0.0.1:3000');
});