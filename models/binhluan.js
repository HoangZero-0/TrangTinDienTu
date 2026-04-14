var mongoose = require("mongoose");

var binhLuanSchema = new mongoose.Schema({
  BaiViet: { type: mongoose.Schema.Types.ObjectId, ref: "BaiViet" },
  TaiKhoan: { type: mongoose.Schema.Types.ObjectId, ref: "TaiKhoan" },
  NoiDung: { type: String, required: true },
  NgayBinhLuan: { type: Date, default: Date.now },
  KiemDuyet: { type: Number, default: 1 },
  BinhLuanCha: { type: mongoose.Schema.Types.ObjectId, ref: "BinhLuan" },
});

var binhLuanModel = mongoose.model("BinhLuan", binhLuanSchema);

module.exports = binhLuanModel;
