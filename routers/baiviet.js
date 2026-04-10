var express = require('express');
var router = express.Router();
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');
var { isAuth, isAdmin } = require('../modules/middlewares');

// GET: Danh sách bài viết
router.get('/', isAdmin, async (req, res) => {
	var bv = await BaiViet.find()
		.populate('ChuDe')
		.populate('TaiKhoan').exec();
	res.render('baiviet', {
		title: 'Danh sách bài viết',
		baiviet: bv
	});
});

// GET: Đăng bài viết
router.get('/them', isAuth, async (req, res) => {
	// Lấy chủ đề hiển thị vào form thêm
	var cd = await ChuDe.find();
	res.render('baiviet_them', {
		title: 'Đăng bài viết',
		chude: cd
	});
});

// POST: Đăng bài viết
router.post('/them', isAuth, async (req, res) => {
	if (req.session.MaNguoiDung) {
		var data = {
			ChuDe: req.body.MaChuDe,
			TaiKhoan: req.session.MaNguoiDung,
			TieuDe: req.body.TieuDe,
			TomTat: req.body.TomTat,
			NoiDung: req.body.NoiDung
		};
		await BaiViet.create(data);
		req.session.success = 'Đã đăng bài viết thành công và đang chờ kiểm duyệt.';
		res.redirect('/success');
	} else {
		res.redirect('/dangnhap');
	}
});

// GET: Sửa bài viết
router.get('/sua/:id', isAuth, async (req, res) => {
	var id = req.params.id;
	var bv = await BaiViet.findById(id);
	if (!bv) return res.redirect('/baiviet/cuatoi');
	
	// Khóa an toàn Sở hữu (IDOR)
	if (req.session.QuyenHan !== 'admin' && bv.TaiKhoan.toString() !== req.session.MaNguoiDung) {
		req.session.error = 'Lỗi Đặc Quyền: Bạn không có quyền sửa bài viết của người khác!';
		return res.redirect('/error');
	}

	var cd = await ChuDe.find();
	res.render('baiviet_sua', {
		title: 'Sửa bài viết',
		chude: cd,
		baiviet: bv
	});
});

// POST: Sửa bài viết
router.post('/sua/:id', isAuth, async (req, res) => {
	var id = req.params.id;
	var bv = await BaiViet.findById(id);
	if (!bv) return res.redirect('/baiviet/cuatoi');
	
	// Khóa an toàn Sở hữu (IDOR)
	if (req.session.QuyenHan !== 'admin' && bv.TaiKhoan.toString() !== req.session.MaNguoiDung) {
		req.session.error = 'Lỗi Đặc Quyền: Bạn không có quyền sửa bài viết của người khác!';
		return res.redirect('/error');
	}

	var data = {
		ChuDe: req.body.MaChuDe,
		TieuDe: req.body.TieuDe,
		TomTat: req.body.TomTat,
		NoiDung: req.body.NoiDung
	};
	await BaiViet.findByIdAndUpdate(id, data);
	req.session.success = 'Đã cập nhật bài viết thành công và đang chờ kiểm duyệt.';
	res.redirect('/success');
});

// POST: Xóa bài viết
router.post('/xoa/:id', isAuth, async (req, res) => {
	var id = req.params.id;
	var bv = await BaiViet.findById(id);
	if (!bv) return res.redirect(req.get('Referrer') || '/');

	// Khóa an toàn Sở hữu (IDOR)
	if (req.session.QuyenHan !== 'admin' && bv.TaiKhoan.toString() !== req.session.MaNguoiDung) {
		req.session.error = 'Lỗi Đặc Quyền: Bạn không có quyền xóa bài viết của người khác!';
		return res.redirect('/error');
	}

	await BaiViet.findByIdAndDelete(id);
	
	// Trở lại trang trước
	res.redirect(req.get('Referrer') || '/');
});

// POST: Duyệt bài viết
router.post('/duyet/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	var bv = await BaiViet.findById(id);
	if (bv) {
		await BaiViet.findByIdAndUpdate(id, { 'KiemDuyet': 1 - bv.KiemDuyet });
	}
	
	// Trở lại trang trước
	res.redirect(req.get('Referrer') || '/');
});

// GET: Danh sách bài viết của tôi
router.get('/cuatoi', isAuth, async (req, res) => {
	if (req.session.MaNguoiDung) {
		// Mã người dùng hiện tại
		var id = req.session.MaNguoiDung;
		var bv = await BaiViet.find({ TaiKhoan: id })
			.populate('ChuDe')
			.populate('TaiKhoan').exec();
		res.render('baiviet_cuatoi', {
			title: 'Bài viết của tôi',
			baiviet: bv
		});
	} else {
		res.redirect('/dangnhap');
	}
});

module.exports = router;