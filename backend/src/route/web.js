import express from "express";
import homeController from "../controllers/homeController";
import productController from "../controllers/productController";
import userController from "../controllers/userController";
import categoryController from "../controllers/categoryController";
import crypto from "crypto";
import request from "request";
// const request = require("request");
const dayjs = require("dayjs");

let router = express.Router();

let initWebRoutes = (app) => {
  //router.get("/api/getAlluser", homeController.displayGetCRUD);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  //User
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-user", userController.getAllUser);
  router.post("/api/create-new-user", userController.createNewUser);
  router.get("/api/delete-user", userController.deleteUserByID);
  router.post("/api/update-user", userController.updateUserData);
  //Bill User History
  // router.get("/api/crud-bill", userController.getCRUDBill);
  router.get("/api/get-bill-by-user-id", userController.getBillByUserID); //history Cart
  router.post("/api/create-bill", userController.createBill);
  router.post("/api/update-bill", userController.updateBill);
  router.get("/api/delete-bill", userController.deleteBill);
  //Product
  router.get("/api/get-all-product", productController.getAllProduct);
  router.get("/api/get-product-by-id", productController.getProductById);
  router.post("/api/create-new-product", productController.createNewProduct);
  router.get("/api/delete-product-by-id", productController.deleteProductByID);
  router.post("/api/update-product", productController.updateProduct);
  //Category
  router.get("/api/get-all-category", categoryController.getAllCategory);
  router.post("/api/create-new-category", categoryController.createNewCategory);
  router.post("/api/update-category", categoryController.updateCategoryCRUD);

  //WhistList
  router.get("/api/get-wishlist", userController.getWishListByUserID); //wishlist
  router.post("/api/create-wishlist", userController.createWishlist); //create and updateupdate
  router.get("/api/delete-wishlist", userController.deleteWishlist);

  //ZaloPayment
  router.post("/api/zalopay-order", function (req, res) {
    const { items, description, amount } = req.body; // Sử dụng items thay vì item
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
      item: JSON.stringify(items), // Dùng items ở đây
      key1: key1,
      mac: "",
    };

    // Tính toán MAC
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
      },
      function (error, response, body) {
        if (body.return_code === 1) {
          console.log("Body:", body);
          res.send(body);
        } else {
          console.log("Error:", body);
          res.status(500).send(body);
        }
      }
    );
  });
  // router.post("/api/zalopay-callback", (req, res) => {
  //   let result = {};
  //   const key2 = "eG4r0GcoNtRGbO8"; // Mã khóa của bạn

  //   try {
  //     let dataStr = req.body.data;
  //     let reqMac = req.body.mac;

  //     // Generate HMAC SHA256
  //     let mac = crypto.createHmac("sha256", key2).update(dataStr).digest("hex");
  //     console.log("mac =", mac);

  //     if (reqMac !== mac) {
  //       // Invalid callback
  //       result.return_code = -1;
  //       result.return_message = "mac not equal";
  //     } else {
  //       // Valid callback, process the data
  //       let dataJson = JSON.parse(dataStr);
  //       console.log(
  //         "Update order's status = success where app_trans_id =",
  //         dataJson["app_trans_id"]
  //       );

  //       // TODO: Update your database here using `app_trans_id` if needed

  //       // Chuyển hướng về trang chủ nếu đơn hủy hoặc đã hoàn thành
  //       result.return_code = 1;
  //       result.return_message = "success";
  //       result.redirect_url = "http://localhost:3000/home"; // URL chuyển hướng về trang chủ
  //     }
  //   } catch (ex) {
  //     result.return_code = 0; // ZaloPay sẽ thử lại tối đa 3 lần
  //     result.return_message = ex.message;
  //   }

  //   res.json(result);
  // });

  return app.use("/", router);
};

module.exports = initWebRoutes;
