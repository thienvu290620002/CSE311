import express from "express";
import homeController from "../controllers/homeController";
import productController from "../controllers/productController";
import userController from "../controllers/userController";
import billController from "../controllers/billController"; // Import billController
import categoryController from "../controllers/categoryController";
import wishListController from "../controllers/wishListController";
import blogController from "../controllers/blogController";
import BillService from "../services/BillService"; // ✅ Import BillService trực tiếp
import cron from "node-cron"; // ✅ Import node-cron

const { singleUpload, userSingleUpload } = require("../middleware/upload");
import crypto from "crypto";
import request from "request";
const dayjs = require("dayjs");

let router = express.Router();
let initWebRoutes = (app) => {
  router.post(
    "/api/upload",
    singleUpload, // Sử dụng middleware đã export
    (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ url: imageUrl });
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed" });
      }
    }
  );
  router.post("/api/upload-user-image", userSingleUpload, (req, res) => {
    if (req.file) {
      // req.file chứa thông tin về file đã upload
      console.log(req.file);

      const imageUrl = `/uploads/${req.file.filename}`; // Đường dẫn để truy cập ảnh
      // Gửi về client URL của ảnh để lưu vào database của user
      return res.status(200).json({
        errCode: 0,
        message: "Upload ảnh người dùng thành công!",
        url: imageUrl,
      });
    } else {
      return res.status(400).json({
        errCode: 1,
        message: "Không có file ảnh được tải lên hoặc định dạng không hợp lệ!",
      });
    }
  });
  // User Routes
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-user", userController.getAllUser);
  router.get("/api/get-user-by-id", userController.getUserInforByID);
  router.post("/api/create-new-user", userController.createNewUser);
  router.get("/api/delete-user", userController.deleteUserByID);
  router.post("/api/update-user", userController.updateUserData);

  // Bill User Routes
  router.get("/api/get-all-bill", billController.getAllBill);
  router.get("/api/get-bill-by-user-id", billController.getBillByUserID); //history Cart
  router.post("/api/create-bill", billController.createBill);
  router.post("/api/update-bill", billController.updateBill);
  router.get(
    "/api/get-All-BillItem-With-Recommendation",
    billController.getAllBillItemWithRecommendation
  );
  // Xóa route này nếu bạn đã dùng node-cron để tự động chạy
  // router.get("/api/auto-update-bill-status", billController.autoUpdateBillStatus);

  // Product Routes
  router.get("/api/get-all-product", productController.getAllProduct);
  router.get(
    "/api/get-product-by-productId",
    productController.getProductByProductId
  );
  router.post(
    "/api/create-new-product",
    singleUpload,
    productController.createNewProduct
  );
  router.get("/api/delete-product-by-id", productController.deleteProductByID);
  router.post("/api/update-product", productController.updateProduct);
  //Blog
  router.get("/api/get-all-blog", blogController.getAllBlog);

  // Category Routes
  router.get("/api/get-all-category", categoryController.getAllCategory);
  router.post("/api/create-new-category", categoryController.createNewCategory);
  router.post("/api/update-category", categoryController.updateCategoryCRUD);

  // Wishlist Routes
  router.get(
    "/api/get-wishlist-by-userId",
    wishListController.getWishListByUserID
  ); //wishlist
  router.post(
    "/api/create-wishlist",
    wishListController.createAndUpdateWishlist
  ); //create and updateupdate
  router.get("/api/delete-wishlist", wishListController.deleteWishlist);

  // ZaloPayment Routes
  router.post("/api/zalopay-order", function (req, res) {
    // ... (Code xử lý ZaloPay của bạn) ...
    const { items, description, amount } = req.body;
    const currentDate = dayjs();
    const app_time = currentDate.valueOf();
    const tranId = currentDate.format("YYMMDD");
    const app_trans_id = `${tranId}_${app_time}`;
    const key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";

    const data = {
      amount: amount,
      app_id: 2553,
      app_time: app_time,
      app_trans_id: app_trans_id,
      app_user: "demo",
      bank_code: "zalopayapp",
      description: description,
      embed_data: JSON.stringify({ redirecturl: "http://localhost:3000/home" }),
      item: JSON.stringify(items),
      key1: key1,
      mac: "",
    };

    const hmac_input = `${data.app_id}|${data.app_trans_id}|${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;
    const mac = crypto
      .createHmac("sha256", key1)
      .update(hmac_input)
      .digest("hex");
    data.mac = mac;

    console.log("data", data);

    request(
      {
        url: "https://sb-openapi.zalopay.vn/v2/create",
        method: "POST",
        json: true,
        body: data,
        timeout: 10000,
      },
      function (error, response, body) {
        if (error) {
          console.error("Request error:", error);
          return res
            .status(500)
            .send({ message: "Error calling ZaloPay API", error });
        }
        if (!body) {
          console.error("Empty body response");
          return res
            .status(500)
            .send({ message: "Empty response from ZaloPay API" });
        }
        if (body.return_code === 1) {
          console.log("Body:", body);
          return res.send(body);
        } else {
          console.log("Error from ZaloPay:", body);
          return res.status(500).send(body);
        }
      }
    );
  });

  // --- CRON JOB START ---
  // ✅ Đặt cron job ở đây, sau khi các service đã được import
  cron.schedule("* * * * *", async () => {
    // Chạy mỗi phút
    // console.log("Running a scheduled task to update bill statuses...");
    try {
      const result = await BillService.autoUpdateBillStatus();
      //console.log(result.message);
    } catch (error) {
      console.error("Failed to run scheduled bill status update:", error);
    }
  });
  // --- CRON JOB END ---

  return app.use("/", router);
};

module.exports = initWebRoutes;
