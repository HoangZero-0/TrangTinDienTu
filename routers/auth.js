var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var TaiKhoan = require('../models/taikhoan');
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');
var { isAdmin } = require('../modules/middlewares');
var upload = require('../modules/upload');

// GET: Đăng ký
router.get('/dangky', async (req, res) => {
	res.render('dangky', {
		title: 'Đăng ký tài khoản'
	});
});

// POST: Đăng ký
router.post('/dangky', upload.single('HinhAnh'), async (req, res) => {
	// Kiểm tra xác nhận mật khẩu
	if (req.body.MatKhau !== req.body.XacNhanMatKhau) {
		req.session.error = 'Mật khẩu xác nhận không khớp, vui lòng thử lại.';
		return res.redirect('/error');
	}
	
	var salt = bcrypt.genSaltSync(10);
	var data = {
		HoVaTen: req.body.HoVaTen,
		Email: req.body.Email,
		TenDangNhap: req.body.TenDangNhap,
		MatKhau: bcrypt.hashSync(req.body.MatKhau, salt)
	};
	if(req.file) data.HinhAnh = '/images/uploads/' + req.file.filename;
	
	try {
		await TaiKhoan.create(data);
		req.session.success = 'Đã đăng ký tài khoản thành công.';
		res.redirect('/success');
	} catch (err) {
		if (err.code === 11000) {
			req.session.error = 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.';
		} else {
			req.session.error = 'Lỗi không xác định: ' + err.message;
		}
		res.redirect('/error');
	}
});

// GET: Đăng nhập
router.get('/dangnhap', async (req, res) => {
	res.render('dangnhap', {
		title: 'Đăng nhập'
	});
});

// POST: Đăng nhập
router.post('/dangnhap', async (req, res) => {
	if(req.session.MaNguoiDung) {
		res.redirect('/');
	} else {
		var taikhoan = await TaiKhoan.findOne({ TenDangNhap: req.body.TenDangNhap }).exec();
		if(taikhoan) {
			if(bcrypt.compareSync(req.body.MatKhau, taikhoan.MatKhau)) {
				if(taikhoan.KichHoat == 0) {
					req.session.error = 'Người dùng đã bị khóa tài khoản.';
					res.redirect('/error');
				} else {
					// Đăng ký session
					req.session.MaNguoiDung = taikhoan._id;
					req.session.HoVaTen = taikhoan.HoVaTen;
					req.session.QuyenHan = taikhoan.QuyenHan;
					
					res.redirect('/');
				}
			} else {
				req.session.error = 'Mật khẩu không đúng.';
				res.redirect('/error');
			}
		} else {
			req.session.error = 'Tên đăng nhập không tồn tại.';
			res.redirect('/error');
		}
	}
});

// GET: Đăng xuất
router.get('/dangxuat', async (req, res) => {
	if(req.session.MaNguoiDung) {
		// Xóa session
		delete req.session.MaNguoiDung;
		delete req.session.HoVaTen;
		delete req.session.QuyenHan;
	}
	res.redirect('/');
});

// GET: Trang quản trị
router.get('/admin', isAdmin, async (req, res) => {
	var countChuDe = await ChuDe.countDocuments();
	var countBaiViet = await BaiViet.countDocuments();
	var countTaiKhoan = await TaiKhoan.countDocuments();
	res.render('admin', {
		title: 'Trang quản trị',
		countChuDe: countChuDe,
		countBaiViet: countBaiViet,
		countTaiKhoan: countTaiKhoan
	});
});

module.exports = router;