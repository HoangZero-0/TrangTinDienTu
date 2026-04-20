// Middleware kiểm tra đăng nhập
function isAuth(req, res, next) {
	if(req.session.MaNguoiDung) {
		return next();
	}
	req.session.error = 'Vui lòng đăng nhập để tiếp tục.';
	res.redirect('/dangnhap');
}

// Middleware kiểm tra quyền admin
function isAdmin(req, res, next) {
	if(req.session.MaNguoiDung && req.session.QuyenHan === 'admin') {
		return next();
	}
	req.session.error = 'Bạn không có quyền truy cập trang quản trị.';
	res.redirect('/');
}

module.exports = { isAuth, isAdmin };
