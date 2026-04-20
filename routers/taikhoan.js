var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var fs = require("fs");
var TaiKhoan = require("../models/taikhoan");
var BaiViet = require("../models/baiviet");
var BinhLuan = require("../models/binhluan");
var { isAuth, isAdmin } = require("../modules/middlewares");
var upload = require("../modules/upload");

// GET: Danh sách tài khoản
router.get("/", isAdmin, async (req, res) => {
  var tk = await TaiKhoan.find().sort({ _id: -1 });
  res.render("taikhoan", {
    title: "Danh sách tài khoản",
    taikhoan: tk,
  });
});

// GET: Thêm tài khoản
router.get("/them", isAdmin, async (req, res) => {
  res.render("taikhoan_them", {
    title: "Thêm tài khoản",
  });
});

// POST: Thêm tài khoản
router.post("/them", isAdmin, upload.single("HinhAnh"), async (req, res) => {
  var tenDangNhap = req.body.TenDangNhap;
  var email = req.body.Email;
  try {
    // Kiểm tra trùng tên đăng nhập
    var existingUser = await TaiKhoan.findOne({ TenDangNhap: tenDangNhap });
    if (existingUser) {
      req.session.error = 'Tên đăng nhập "' + tenDangNhap + '" đã tồn tại.';
      return req.session.save(() => res.redirect("/taikhoan/them"));
    }

    // Kiểm tra trùng Email
    if (email) {
      var existingEmail = await TaiKhoan.findOne({ Email: email });
      if (existingEmail) {
        req.session.error = 'Email "' + email + '" đã được sử dụng bởi tài khoản khác.';
        return req.session.save(() => res.redirect("/taikhoan/them"));
      }
    }

    var salt = bcrypt.genSaltSync(10);
    var data = {
      HoVaTen: req.body.HoVaTen,
      Email: email,
      TenDangNhap: tenDangNhap,
      MatKhau: bcrypt.hashSync(req.body.MatKhau, salt),
    };
    if (req.file) data.HinhAnh = "/images/uploads/" + req.file.filename;
    await TaiKhoan.create(data);
    req.session.success = "Đã thêm tài khoản thành công.";
    req.session.save(() => res.redirect("/taikhoan"));
  } catch (err) {
    req.session.error = "Lỗi hệ thống: " + err.message;
    req.session.save(() => res.redirect("/taikhoan/them"));
  }
});

// GET: Sửa tài khoản
router.get("/sua/:id", isAdmin, async (req, res) => {
  var id = req.params.id;
  var tk = await TaiKhoan.findById(id);
  res.render("taikhoan_sua", {
    title: "Sửa tài khoản",
    taikhoan: tk,
  });
});

// POST: Sửa tài khoản
router.post("/sua/:id", isAdmin, upload.single("HinhAnh"), async (req, res) => {
  var id = req.params.id;
  var tenDangNhap = req.body.TenDangNhap;
  try {
    var tk = await TaiKhoan.findById(id);
    if (!tk) {
      req.session.error = "Tài khoản không tồn tại.";
      return req.session.save(() => res.redirect("/taikhoan"));
    }

    // Kiểm tra trùng tên đăng nhập với người khác
    var existingUser = await TaiKhoan.findOne({ TenDangNhap: tenDangNhap, _id: { $ne: id } });
    if (existingUser) {
      req.session.error = 'Tên đăng nhập "' + tenDangNhap + '" đã tồn tại.';
      return req.session.save(() => res.redirect("/taikhoan/sua/" + id));
    }

    // Kiểm tra trùng Email với người khác
    var email = req.body.Email;
    if (email) {
      var existingEmail = await TaiKhoan.findOne({ Email: email, _id: { $ne: id } });
      if (existingEmail) {
        req.session.error = 'Email "' + email + '" đã được sử dụng bởi tài khoản khác.';
        return req.session.save(() => res.redirect("/taikhoan/sua/" + id));
      }
    }

    var salt = bcrypt.genSaltSync(10);

    // Không cho tự đổi quyền hoặc khóa nếu là bản thân
    var quyenHan =
      id == req.session.MaNguoiDung ? tk.QuyenHan : req.body.QuyenHan;
    var kichHoat =
      id == req.session.MaNguoiDung ? tk.KichHoat : req.body.KichHoat;

    var data = {
      HoVaTen: req.body.HoVaTen,
      Email: req.body.Email,
      TenDangNhap: tenDangNhap,
      QuyenHan: quyenHan,
      KichHoat: kichHoat,
    };
    if (req.file) {
      data.HinhAnh = "/images/uploads/" + req.file.filename;
      if (tk && tk.HinhAnh) {
        try {
          var filePath = "./public" + tk.HinhAnh;
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (err) {}
      }
    }
    if (req.body.MatKhau)
      data["MatKhau"] = bcrypt.hashSync(req.body.MatKhau, salt);
    
    await TaiKhoan.findByIdAndUpdate(id, data);
    
    // Cập nhật lại session nếu người dùng sửa chính mình
    if (id == req.session.MaNguoiDung) {
      if (data.HoVaTen) req.session.HoVaTen = data.HoVaTen;
      if (data.HinhAnh) req.session.HinhAnh = data.HinhAnh;
    }
    
    req.session.success = "Đã cập nhật tài khoản thành công.";
    req.session.save(() => res.redirect("/taikhoan"));
  } catch (err) {
    req.session.error = "Lỗi hệ thống: " + err.message;
    req.session.save(() => res.redirect("/taikhoan/sua/" + id));
  }
});

// POST: Xóa tài khoản
router.post("/xoa/:id", isAdmin, async (req, res) => {
  var id = req.params.id;
  if (id == req.session.MaNguoiDung) {
    req.session.error =
      "Lỗi Đặc Quyền: Bạn không thể tự xóa tài khoản của chính mình!";
    return req.session.save(() => res.redirect("/taikhoan"));
  }
  try {
    var tk = await TaiKhoan.findById(id);
    if (tk && tk.HinhAnh) {
      try {
        var filePath = "./public" + tk.HinhAnh;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {}
    }
    var adminId = req.session.MaNguoiDung;
    await TaiKhoan.findByIdAndDelete(id);
    
    // Luồng chuyên nghiệp: Chuyển nhượng bài viết và bình luận sang cho Admin
    await BaiViet.updateMany({ TaiKhoan: id }, { TaiKhoan: adminId });
    await BinhLuan.updateMany({ TaiKhoan: id }, { TaiKhoan: adminId });
    
    req.session.success = "Đã xóa tài khoản và chuyển nhượng toàn bộ nội dung sang Ban quản trị thành công.";
    req.session.save(() => res.redirect("/taikhoan"));
  } catch (err) {
    req.session.error = "Lỗi hệ thống: " + err.message;
    req.session.save(() => res.redirect("/taikhoan"));
  }
});

// GET: Hồ sơ cá nhân
router.get("/hoso", isAuth, async (req, res) => {
  var id = req.session.MaNguoiDung;
  var tk = await TaiKhoan.findById(id);
  res.render("taikhoan_hoso", {
    title: "Hồ sơ cá nhân",
    taikhoan: tk,
  });
});

// POST: Hồ sơ cá nhân
router.post("/hoso", isAuth, upload.single("HinhAnh"), async (req, res) => {
  var id = req.session.MaNguoiDung;
  try {
    var salt = bcrypt.genSaltSync(10);
    var data = {
      HoVaTen: req.body.HoVaTen,
      Email: req.body.Email,
    };
    if (req.file) {
      data.HinhAnh = "/images/uploads/" + req.file.filename;
      var tk = await TaiKhoan.findById(id);
      if (tk && tk.HinhAnh) {
        try {
          var filePath = "./public" + tk.HinhAnh;
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (err) {}
      }
    }
    if (req.body.MatKhau)
      data["MatKhau"] = bcrypt.hashSync(req.body.MatKhau, salt);
    
    await TaiKhoan.findByIdAndUpdate(id, data);

    req.session.HoVaTen = req.body.HoVaTen;
    if (data.HinhAnh) {
      req.session.HinhAnh = data.HinhAnh;
    }
    
    req.session.success = "Đã cập nhật hồ sơ cá nhân thành công.";
    req.session.save(() => res.redirect("/taikhoan/hoso"));
  } catch (err) {
    req.session.error = "Lỗi hệ thống: " + err.message;
    req.session.save(() => res.redirect("/taikhoan/hoso"));
  }
});

module.exports = router;
