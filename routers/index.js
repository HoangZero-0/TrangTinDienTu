var express = require('express');
var router = express.Router();
var firstImage = require('../modules/firstimage');
var upload = require('../modules/upload');
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');
var BinhLuan = require('../models/binhluan');
var TaiKhoan = require('../models/taikhoan');
var { isAuth } = require('../modules/middlewares');

// GET: Trang chủ
router.get('/', async (req, res) => {
	var perPage = 12;
	var page = req.query.page || 1;
	
	// Lấy chuyên mục hiển thị vào menu
	var cm = await ChuDe.find();
	
	// Lấy 12 bài viết phân trang
	var bv = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ NgayDang: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.skip((perPage * page) - perPage)
		.limit(perPage).exec();
		
	var count = await BaiViet.countDocuments({ KiemDuyet: 1 });
	var pages = Math.ceil(count / perPage);
	
	// Lấy 3 bài viết xem nhiều nhất hiển thị vào cột phải
	var xnn = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();

	res.render('index', {
		title: 'Trang chủ',
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		current: page,
		pages: pages,
		firstImage: firstImage
	});
});

// GET: Lấy các bài viết cùng mã chủ đề
router.get('/baiviet/chude/:id', async (req, res) => {
	var id = req.params.id;

	// Lấy chuyên mục hiển thị vào menu
	var cm = await ChuDe.find();

	// Lấy thông tin chủ đề hiện tại
	var cd = await ChuDe.findById(id);

	// Lấy 8 bài viết mới nhất cùng chuyên mục
	var bv = await BaiViet.find({ KiemDuyet: 1, ChuDe: id })
		.sort({ NgayDang: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(8).exec();

	// Lấy 3 bài viết xem nhiều nhất hiển thị vào cột phải
	var xnn = await BaiViet.find({ KiemDuyet: 1, ChuDe: id })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();

	res.render('baiviet_chude', {
		title: 'Bài viết cùng chuyên mục',
		chuyenmuc: cm,
		chude: cd,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});
});

// GET: Xem bài viết
router.get('/baiviet/chitiet/:id', async (req, res) => {
	var id = req.params.id;

	// Lấy chuyên mục hiển thị vào menu
	var cm = await ChuDe.find();

	// Lấy thông tin bài viết hiện tại
	var bv = await BaiViet.findById(id)
		.populate('ChuDe')
		.populate('TaiKhoan').exec();

	if (!bv) {
		req.session.error = 'Bài viết không tồn tại.';
		return res.redirect('/error');
	}

	// Chặn xem bài chưa duyệt nếu không phải Admin hoặc Tác giả
	if (bv.KiemDuyet === 0) {
		if (req.session.QuyenHan !== 'admin' && (!req.session.MaNguoiDung || bv.TaiKhoan._id.toString() !== req.session.MaNguoiDung)) {
			// Bài viết chưa duyệt, ẩn đi với độc giả thường
			req.session.error = 'Bài viết này đang chờ Ban biên tập kiểm duyệt.';
			return res.redirect('/error');
		}
	}

	// Lấy bình luận của bài viết
	var bl = await BinhLuan.find({ BaiViet: id, KiemDuyet: 1 })
		.sort({ NgayBinhLuan: 1 }) // Sắp xếp theo thứ tự thời gian tăng dần
		.populate('TaiKhoan').exec();

	// Tổ chức bình luận theo phân cấp (cha-con)
	var rootComments = bl.filter(c => !c.BinhLuanCha);
	var replies = bl.filter(c => c.BinhLuanCha);
	
	rootComments.forEach(parent => {
		parent.replies = replies.filter(child => child.BinhLuanCha.toString() === parent._id.toString());
	});

	// Xử lý bài viết liên quan (cùng chủ đề, giới hạn 4 bài)
	var bvlq = [];
	if (bv.ChuDe) {
		bvlq = await BaiViet.find({ 
			KiemDuyet: 1, 
			ChuDe: bv.ChuDe._id, 
			_id: { $ne: id } // Loại trừ bài viết hiện tại
		})
		.sort({ NgayDang: -1 })
		.limit(4).exec();
	}

	// Xử lý tăng lượt xem bài viết
	if(!req.session.DaXem) req.session.DaXem = [];
	if(!req.session.DaXem.includes(id)) {
		await BaiViet.findByIdAndUpdate(id, { $inc: { LuotXem: 1 } });
		req.session.DaXem.push(id);
	}
	// Lấy 3 bài viết xem nhiều nhất hiển thị vào cột phải
	var xnn = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();

	// Kiểm tra bài viết đã lưu chưa (nếu đã đăng nhập)
	var daLuu = false;
	if (req.session.MaNguoiDung) {
		var user = await TaiKhoan.findById(req.session.MaNguoiDung);
		if (user && user.BaiVietDaLuu.includes(id)) {
			daLuu = true;
		}
	}

	res.render('baiviet_chitiet', {
		chuyenmuc: cm,
		baiviet: bv,
		binhluan: rootComments,
		baivietlienquan: bvlq,
		xemnhieunhat: xnn,
		firstImage: firstImage,
		daLuu: daLuu
	});
});

// POST: Gửi bình luận
router.post('/binhluan/:id', isAuth, async (req, res) => {
	var id = req.params.id;
	var data = {
		BaiViet: id,
		TaiKhoan: req.session.MaNguoiDung,
		NoiDung: req.body.NoiDung
	};
	if (req.body.BinhLuanCha) data.BinhLuanCha = req.body.BinhLuanCha;
	
	await BinhLuan.create(data);
	req.session.success = 'Gửi bình luận thành công.';
	res.redirect('/baiviet/chitiet/' + id);
});

// POST: Lưu hoặc bỏ lưu bài viết
router.post('/baiviet/luu/:id', isAuth, async (req, res) => {
	var id = req.params.id;
	var userId = req.session.MaNguoiDung;
	
	var user = await TaiKhoan.findById(userId);
	if (!user) return res.json({ success: false });

	var index = user.BaiVietDaLuu.indexOf(id);
	if (index === -1) {
		// Chưa lưu thì thêm vào
		user.BaiVietDaLuu.push(id);
	} else {
		// Đã lưu thì xóa đi
		user.BaiVietDaLuu.splice(index, 1);
	}
	
	await user.save();
	req.session.success = (index === -1 ? 'Đã lưu' : 'Đã bỏ lưu') + ' bài viết thành công.';
	res.redirect(req.get('Referrer') || '/baiviet/chitiet/' + id);
});

// GET: Danh sách bài viết đã lưu
router.get('/baiviet/daluu', isAuth, async (req, res) => {
	var cm = await ChuDe.find();
	var userId = req.session.MaNguoiDung;
	
	var user = await TaiKhoan.findById(userId).populate({
		path: 'BaiVietDaLuu',
		populate: { path: 'ChuDe' }
	}).exec();

	res.render('baiviet_daluu', {
		title: 'Bài viết đã lưu',
		chuyenmuc: cm,
		baiviet: user ? user.BaiVietDaLuu : [],
		firstImage: firstImage
	});
});

// GET: Liên hệ
router.get('/lienhe', async (req, res) => {
	var cm = await ChuDe.find();
	res.render('lienhe', {
		title: 'Liên hệ',
		chuyenmuc: cm
	});
});

// GET: Chính sách riêng tư
router.get('/chinhsach', async (req, res) => {
	var cm = await ChuDe.find();
	res.render('chinhsach', {
		title: 'Chính sách riêng tư',
		chuyenmuc: cm
	});
});

// GET: Tin mới nhất
router.get('/tinmoi', async (req, res) => {
	var bv = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ NgayDang: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(50).exec();
		
	res.render('tinmoinhat', {
		title: 'Tin mới nhất',
		baiviet: bv,
		firstImage: firstImage
	});
});

// GET: Kết quả tìm kiếm
router.get('/timkiem', async (req, res) => {
	var tukhoa = req.query.tukhoa;
	
	// Escape ký tự đặc biệt regex để chống ReDoS
	var escapedTukhoa = tukhoa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	
	// Xử lý tìm kiếm bài viết
	var bv = await BaiViet.find({ KiemDuyet: 1, TieuDe: new RegExp(escapedTukhoa, 'i') })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.exec();
	
	// Render view timkiem.ejs
	res.render('timkiem', {
		title: 'Kết quả tìm kiếm',
		baiviet: bv,
		tukhoa: tukhoa,
		firstImage: firstImage
	});
});

// POST: Upload hình ảnh từ CKEditor
router.post('/upload', isAuth, upload.single('upload'), async (req, res) => {
	res.status(200).json({
		uploaded: 1,
		fileName: req.file.filename,
		url: '/images/uploads/' + req.file.filename
	});
});

// GET: Lỗi
router.get('/error', async (req, res) => {
	res.render('error', {
		title: 'Lỗi'
	});
});

// GET: Thành công
router.get('/success', async (req, res) => {
	res.render('success', {
		title: 'Hoàn thành'
	});
});

module.exports = router;