var express = require('express');
var router = express.Router();
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');
var BinhLuan = require('../models/binhluan');
var TaiKhoan = require('../models/taikhoan');
var { isAuth, isAdmin } = require('../modules/middlewares');

// GET: Danh sách bài viết
router.get('/', isAdmin, async (req, res) => {
	var bv = await BaiViet.find()
		.populate('ChuDe')
		.populate('TaiKhoan')
		.sort({ _id: -1 }).exec();
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
	try {
		var data = {
			ChuDe: req.body.MaChuDe,
			TaiKhoan: req.session.MaNguoiDung,
			TieuDe: req.body.TieuDe,
			TomTat: req.body.TomTat,
			NoiDung: req.body.NoiDung
		};
		await BaiViet.create(data);
		req.session.success = 'Đã đăng bài viết thành công và đang chờ kiểm duyệt.';
		// Nếu là admin đăng bài, quay về trang quản lý chung, ngược lại quay về trang cá nhân
		var redirectPath = (req.session.QuyenHan === 'admin') ? '/baiviet' : '/baiviet/cuatoi';
		req.session.save(() => res.redirect(redirectPath));
	} catch (err) {
		req.session.error = 'Lỗi hệ thống: ' + err.message;
		req.session.save(() => res.redirect('/baiviet/them'));
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
		return req.session.save(() => res.redirect('/baiviet/cuatoi'));
	}

	// Xác định chế độ Admin (để cho phép sửa bài đã duyệt)
	var isAdminMode = req.query.mode === 'admin' && req.session.QuyenHan === 'admin';

	// Chặn sửa bài đã duyệt nếu không phải đang ở chế độ Quản trị (Dành cho cả Admin ở trang cá nhân)
	if (!isAdminMode && bv.KiemDuyet === 1) {
		req.session.error = 'Bài viết đã được duyệt, không thể chỉnh sửa từ trang cá nhân.';
		return req.session.save(() => res.redirect('/baiviet/cuatoi'));
	}

	var cd = await ChuDe.find();
	res.render('baiviet_sua', {
		title: 'Sửa bài viết',
		chude: cd,
		baiviet: bv,
		isAdminMode: isAdminMode
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
		return req.session.save(() => res.redirect('/baiviet/cuatoi'));
	}

	// Xác định chế độ Admin (để cho phép sửa bài đã duyệt)
	var isAdminMode = req.query.mode === 'admin' && req.session.QuyenHan === 'admin';

	// Chặn sửa bài đã duyệt nếu không phải đang ở chế độ Quản trị (Dành cho cả Admin ở trang cá nhân)
	if (!isAdminMode && bv.KiemDuyet === 1) {
		req.session.error = 'Bài viết đã được duyệt, không thể chỉnh sửa từ trang cá nhân.';
		return req.session.save(() => res.redirect('/baiviet/cuatoi'));
	}

	try {
		var data = {
			ChuDe: req.body.MaChuDe,
			TieuDe: req.body.TieuDe,
			TomTat: req.body.TomTat,
			NoiDung: req.body.NoiDung
		};
		await BaiViet.findByIdAndUpdate(id, data);
		req.session.success = 'Đã cập nhật bài viết thành công.';
		// Nếu đang ở chế độ admin, quay về trang quản lý chung, ngược lại quay về trang cá nhân
		var redirectPath = isAdminMode ? '/baiviet' : '/baiviet/cuatoi';
		req.session.save(() => res.redirect(redirectPath));
	} catch (err) {
		req.session.error = 'Lỗi hệ thống: ' + err.message;
		req.session.save(() => res.redirect('/baiviet/sua/' + id + (isAdminMode ? '?mode=admin' : '')));
	}
});

// POST: Xóa bài viết
router.post('/xoa/:id', isAuth, async (req, res) => {
	var id = req.params.id;
	var bv = await BaiViet.findById(id);
	if (!bv) return res.redirect(req.get('Referrer') || '/');

	// Khóa an toàn Sở hữu (IDOR)
	if (req.session.QuyenHan !== 'admin' && bv.TaiKhoan.toString() !== req.session.MaNguoiDung) {
		req.session.error = 'Lỗi Đặc Quyền: Bạn không có quyền xóa bài viết của người khác!';
		return res.redirect('/baiviet/cuatoi');
	}

	try {
		await BaiViet.findByIdAndDelete(id);
		// Xóa các bình luận liên quan bài viết
		await BinhLuan.deleteMany({ BaiViet: id });
		// Gỡ bài viết khỏi danh sách đã lưu của tất cả người dùng
		await TaiKhoan.updateMany({}, { $pull: { BaiVietDaLuu: id } });
		
		req.session.success = 'Đã xóa bài viết và dọn dẹp dữ liệu liên quan thành công.';
		req.session.save(() => res.redirect(req.get('Referrer') || '/'));
	} catch (err) {
		req.session.error = 'Lỗi hệ thống: ' + err.message;
		req.session.save(() => res.redirect(req.get('Referrer') || '/'));
	}
});

// POST: Duyệt bài viết
router.post('/duyet/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	try {
		var bv = await BaiViet.findById(id);
		if (bv) {
			var status = 1 - bv.KiemDuyet;
			await BaiViet.findByIdAndUpdate(id, { 'KiemDuyet': status });
			req.session.success = (status === 1 ? 'Đã duyệt' : 'Đã bỏ duyệt') + ' bài viết thành công.';
		}
		req.session.save(() => res.redirect(req.get('Referrer') || '/'));
	} catch (err) {
		req.session.error = 'Lỗi hệ thống: ' + err.message;
		req.session.save(() => res.redirect(req.get('Referrer') || '/'));
	}
});

// GET: Danh sách bài viết của tôi
router.get('/cuatoi', isAuth, async (req, res) => {
	var id = req.session.MaNguoiDung;
	var bv = await BaiViet.find({ TaiKhoan: id })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.sort({ _id: -1 }).exec();
	res.render('baiviet_cuatoi', {
		title: 'Bài viết của tôi',
		baiviet: bv
	});
});

module.exports = router;