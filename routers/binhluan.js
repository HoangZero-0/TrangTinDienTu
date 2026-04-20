var express = require('express');
var router = express.Router();
var BinhLuan = require('../models/binhluan');
var { isAdmin } = require('../modules/middlewares');

// GET: Danh sách bình luận
router.get('/', isAdmin, async (req, res) => {
	var bl = await BinhLuan.find().populate('BaiViet').populate('TaiKhoan').sort({ NgayBinhLuan: -1 });
	res.render('binhluan', {
		title: 'Danh sách bình luận',
		binhluan: bl
	});
});

// POST: Duyệt bình luận (Toggle duyệt / bỏ duyệt)
router.post('/duyet/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	var bl = await BinhLuan.findById(id);
	if(bl) {
		bl.KiemDuyet = bl.KiemDuyet === 1 ? 0 : 1;
		await bl.save();
		req.session.success = (bl.KiemDuyet === 1 ? 'Đã duyệt' : 'Đã bỏ duyệt') + ' bình luận thành công.';
	}
	res.redirect('/binhluan');
});

// POST: Xóa bình luận
router.post('/xoa/:id', isAdmin, async (req, res) => {
	var id = req.params.id;
	await BinhLuan.findByIdAndDelete(id);
	req.session.success = 'Đã xóa bình luận thành công.';
	res.redirect('/binhluan');
});

module.exports = router;
