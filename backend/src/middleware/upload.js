// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Tạo thư mục uploads nếu chưa tồn tại
// const uploadDir = path.join(__dirname, "../public/uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Cấu hình storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname); // .jpg, .png,...
//     const productName = req.body.productName || "image"; // Lấy tên sản phẩm từ form
//     console.log(req.body.productName);

//     // Convert tên sản phẩm thành slug (viết thường, không dấu, không khoảng trắng)
//     const slug = productName
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
//       .replace(/[^a-z0-9]+/g, "-") // Chuyển khoảng trắng/thứ khác thành "-"
//       .replace(/^-+|-+$/g, ""); // Xóa dấu - đầu/cuối

//     const timestamp = Date.now(); // Đảm bảo không trùng

//     const newFilename = `${slug}-${timestamp}${ext}`;
//     cb(null, newFilename);
//   },
// });

// // Tạo middleware upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Chỉ chấp nhận file ảnh!"), false);
//     }
//   },
// });

// // Xuất middleware upload cho một file duy nhất
// module.exports = {
//   singleUpload: upload.single("image"), // Cho route upload đơn, chỉ xử lý 1 ảnh
// };
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage chung cho ảnh sản phẩm (và mặc định)
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const productName = req.body.productName || "image"; // Mặc định là "image" nếu không có tên sản phẩm
    const slug = productName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const timestamp = Date.now();
    const newFilename = `${slug}-${timestamp}${ext}`;
    cb(null, newFilename);
  },
});

// Cấu hình storage riêng cho ảnh người dùng
const userImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Vẫn lưu vào cùng thư mục uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const userId = req.body.userId || "unknown-user"; // Lấy userId từ form data, fallback nếu không có

    // Tên file cho ảnh người dùng: user-[id]-timestamp.ext
    const newFilename = `user-${userId}-${timestamp}${ext}`;
    cb(null, newFilename);
  },
});

// Middleware upload cho ảnh sản phẩm (hoặc ảnh chung)
const productUpload = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
  },
});

// Middleware upload riêng cho ảnh người dùng
const userImageUpload = multer({
  storage: userImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
  },
});

module.exports = {
  singleUpload: productUpload.single("image"), // Đổi tên để dễ hiểu hơn là cho Product
  userSingleUpload: userImageUpload.single("image"), // ✅ Middleware riêng cho ảnh người dùng
};
