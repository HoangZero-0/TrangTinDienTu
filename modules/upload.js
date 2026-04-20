var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	}
});

var upload = multer({ 
	storage: storage,
	limits: { fileSize: 2 * 1024 * 1024 } // Giới hạn 2MB
});
module.exports = upload;
