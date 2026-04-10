var express = require('express');
var router = express.Router();
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');
var { isAdmin } = require('../modules/middlewares');

// GET: Danh sách chủ đề
router.get('/', isAdmin, async (req, res) => {
	var cd = await ChuDe.find();
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
	var data = {
		TenChuDe: req.body.TenChuDe
	};
	await ChuDe.create(data);
	res.redirect('/chude');
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
	var data = {
		TenChuDe: req.body.TenChuDe
	};
	await ChuDe.findByIdAndUpdate(id, data);
	res.redirect('/chude');
});

// POST: Xóa chủ đề
router.post('/xoa/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	
	// Kiểm tra bài viết thuộc chủ đề trước khi xóa
	var countBV = await BaiViet.countDocuments({ ChuDe: id });
	if (countBV > 0) {
		req.session.error = 'Không thể xóa chủ đề này vì còn ' + countBV + ' bài viết liên quan.';
		return res.redirect('/error');
	}
	
	await ChuDe.findByIdAndDelete(id);
	res.redirect('/chude');
});

module.exports = router;