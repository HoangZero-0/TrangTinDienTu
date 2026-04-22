var express = require('express');
var router = express.Router();
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');
var { isAdmin } = require('../modules/middlewares');

// GET: Danh sách chủ đề
router.get('/', isAdmin, async (req, res) => {
	var cd = await ChuDe.find().sort({ _id: -1 });
	res.render('chude', {
		title: 'Danh sách chủ đề',
		chude: cd
	});
});

// GET: Thêm chủ đề
router.get('/them', isAdmin, async (req, res) => {
	res.render('chude_them', {
		title: 'Thêm chủ đề'
	});
});

// POST: Thêm chủ đề
router.post('/them', isAdmin, async (req, res) => {
	var tenChuDe = req.body.TenChuDe;
	try {
		// Kiểm tra trùng tên (không phân biệt hoa thường)
		var existing = await ChuDe.findOne({ TenChuDe: { $regex: new RegExp('^' + tenChuDe + '$', 'i') } });
		if (existing) {
			req.session.error = 'Tên chủ đề "' + tenChuDe + '" đã tồn tại.';
			return req.session.save(() => res.redirect('/chude/them'));
		}
		
		await ChuDe.create({ TenChuDe: tenChuDe });
		req.session.success = 'Đã thêm chủ đề thành công.';
		req.session.save(() => res.redirect('/chude'));
	} catch (err) {
		req.session.error = 'Lỗi hệ thống: ' + err.message;
		req.session.save(() => res.redirect('/chude/them'));
	}
});

// GET: Sửa chủ đề
router.get('/sua/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	var cd = await ChuDe.findById(id);
	res.render('chude_sua', {
		title: 'Sửa chủ đề',
		chude: cd
	});
});

// POST: Sửa chủ đề
router.post('/sua/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	var tenChuDe = req.body.TenChuDe;
	try {
		// Kiểm tra trùng tên với các chủ đề khác (không phân biệt hoa thường)
		var existing = await ChuDe.findOne({ 
			TenChuDe: { $regex: new RegExp('^' + tenChuDe + '$', 'i') }, 
			_id: { $ne: id } 
		});
		if (existing) {
			req.session.error = 'Tên chủ đề "' + tenChuDe + '" đã tồn tại.';
			return req.session.save(() => res.redirect('/chude/sua/' + id));
		}

		await ChuDe.findByIdAndUpdate(id, { TenChuDe: tenChuDe });
		req.session.success = 'Đã cập nhật chủ đề thành công.';
		req.session.save(() => res.redirect('/chude'));
	} catch (err) {
		req.session.error = 'Lỗi hệ thống: ' + err.message;
		req.session.save(() => res.redirect('/chude/sua/' + id));
	}
});

// POST: Xóa chủ đề
router.post('/xoa/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	
	// Kiểm tra bài viết thuộc chủ đề trước khi xóa
	var countBV = await BaiViet.countDocuments({ ChuDe: id });
	if (countBV > 0) {
		req.session.error = 'Không thể xóa chủ đề này vì còn ' + countBV + ' bài viết liên quan.';
		return req.session.save(() => res.redirect('/chude'));
	}
	
	try {
		await ChuDe.findByIdAndDelete(id);
		req.session.success = 'Đã xóa chủ đề thành công.';
		req.session.save(() => res.redirect('/chude'));
	} catch (err) {
		req.session.error = 'Lỗi hệ thống: ' + err.message;
		req.session.save(() => res.redirect('/chude'));
	}
});

module.exports = router;