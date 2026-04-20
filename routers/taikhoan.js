var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var fs = require('fs');
var TaiKhoan = require('../models/taikhoan');
var { isAuth, isAdmin } = require('../modules/middlewares');
var upload = require('../modules/upload');

// GET: Danh sách tài khoản
router.get('/', isAdmin, async (req, res) => {
	var tk = await TaiKhoan.find();
	res.render('taikhoan', {
		title: 'Danh sách tài khoản',
		taikhoan: tk
	});
});

// GET: Thêm tài khoản
router.get('/them', isAdmin, async (req, res) => {
	res.render('taikhoan_them', {
		title: 'Thêm tài khoản'
	});
});

// POST: Thêm tài khoản
router.post('/them', isAdmin, upload.single('HinhAnh'), async (req, res) => {
	var salt = bcrypt.genSaltSync(10);
	var data = {
		HoVaTen: req.body.HoVaTen,
		Email: req.body.Email,
		TenDangNhap: req.body.TenDangNhap,
		MatKhau: bcrypt.hashSync(req.body.MatKhau, salt)
	};
	if(req.file) data.HinhAnh = '/images/uploads/' + req.file.filename;
	await TaiKhoan.create(data);
	req.session.success = 'Đã thêm tài khoản thành công.';
	res.redirect('/taikhoan');
});

// GET: Sửa tài khoản
router.get('/sua/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	var tk = await TaiKhoan.findById(id);
	res.render('taikhoan_sua', {
		title: 'Sửa tài khoản',
		taikhoan: tk
	});
});

// POST: Sửa tài khoản
router.post('/sua/:id', isAdmin, upload.single('HinhAnh'), async (req, res) => {
	var id = req.params.id;
	var salt = bcrypt.genSaltSync(10);
	var data = {
		HoVaTen: req.body.HoVaTen,
		Email: req.body.Email,
		TenDangNhap: req.body.TenDangNhap,
		QuyenHan: req.body.QuyenHan,
		KichHoat: req.body.KichHoat
	};
	if(req.file) {
		data.HinhAnh = '/images/uploads/' + req.file.filename;
		var tk = await TaiKhoan.findById(id);
		if(tk && tk.HinhAnh) {
			try {
				var filePath = './public' + tk.HinhAnh;
				if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
			} catch(err) {}
		}
	}
	if(req.body.MatKhau)
		data['MatKhau'] = bcrypt.hashSync(req.body.MatKhau, salt);
	await TaiKhoan.findByIdAndUpdate(id, data);
	req.session.success = 'Đã cập nhật tài khoản thành công.';
	res.redirect('/taikhoan');
});

// POST: Xóa tài khoản
router.post('/xoa/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	var tk = await TaiKhoan.findById(id);
	if(tk && tk.HinhAnh) {
		try {
			var filePath = './public' + tk.HinhAnh;
			if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
		} catch(err) {}
	}
	await TaiKhoan.findByIdAndDelete(id);
	req.session.success = 'Đã xóa tài khoản thành công.';
	res.redirect('/taikhoan');
});

// GET: Hồ sơ cá nhân
router.get('/hoso', isAuth, async (req, res) => {
	var id = req.session.MaNguoiDung;
	var tk = await TaiKhoan.findById(id);
	res.render('taikhoan_hoso', {
		title: 'Hồ sơ cá nhân',
		taikhoan: tk
	});
});

// POST: Hồ sơ cá nhân
router.post('/hoso', isAuth, upload.single('HinhAnh'), async (req, res) => {
	var id = req.session.MaNguoiDung;
	var salt = bcrypt.genSaltSync(10);
	var data = {
		HoVaTen: req.body.HoVaTen,
		Email: req.body.Email
	};
	if(req.file) {
		data.HinhAnh = '/images/uploads/' + req.file.filename;
		var tk = await TaiKhoan.findById(id);
		if(tk && tk.HinhAnh) {
			try {
				var filePath = './public' + tk.HinhAnh;
				if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
			} catch(err) {}
		}
	}
	if(req.body.MatKhau)
		data['MatKhau'] = bcrypt.hashSync(req.body.MatKhau, salt);
	await TaiKhoan.findByIdAndUpdate(id, data);
	
	req.session.HoVaTen = req.body.HoVaTen;
	req.session.success = 'Đã cập nhật hồ sơ cá nhân thành công.';
	res.redirect('/taikhoan/hoso');
});

module.exports = router;