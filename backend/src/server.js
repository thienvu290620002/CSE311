import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors"; // Sử dụng thư viện cors
require("dotenv").config();
const multer = require("multer");
const path = require("path");
let app = express();

// Cấu hình CORS với cors middleware
const corsOptions = {
  origin: process.env.URL_REACT, // Chỉ cho phép domain này truy cập API
  methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  allowedHeaders: "X-Requested-With, Content-Type",
  credentials: true, // Nếu bạn cần hỗ trợ cookies hoặc session
};

// Sử dụng cors middleware cho tất cả các route
app.use(cors(corsOptions));
//Multer
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});
// Config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); // Giải mã dữ liệu form URL-encoded (form data)
app.use(express.json()); // Giải mã dữ liệu JSON
viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8089;
app.listen(port, () => {
  console.log("Backend Nodejs is running on port : " + port);
});
