import express from "express";
import homeController from "../controllers/homeController";
import productController from "../controllers/productController";
import userController from "../controllers/userController";
import categoryController from "../controllers/categoryController";
import momoPaymentController from "../controllers/momoPaymentController";
import crypto from "crypto";
const request = require("request");
const dayjs = require("dayjs");

let router = express.Router();

let initWebRoutes = (app) => {
  //router.get("/api/getAlluser", homeController.displayGetCRUD);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  //User
  router.post("/api/login", userController.handleLogin);
  router.get("/api/getAllUser", userController.getAllUser);
  router.post("/api/createNewUser", userController.createNewUser);
  router.get("/api/deleteUser", userController.deleteUserCRUD);
  router.post("/api/updateUser", userController.updateUserCRUD);
  //Bill User History
  // router.get("/api/crud-bill", userController.getCRUDBill);
  router.get("/api/get-bill-by-user-id", userController.getBillByUserID); //history Cart
  router.post("/api/create-bill", userController.createBill);
  router.post("/api/update-bill", userController.updateBill);
  router.get("/api/delete-bill", userController.deleteBill);
  //Product
  router.get("/api/getAllProduct", productController.getAllProduct);
  router.post("/api/createNewProduct", productController.createNewProduct);
  router.get("/api/deleteProductByID", productController.deleteProductByID);
  router.post("/api/updateProduct", productController.updateProduct);
  //Category
  router.get("/api/getAllCategory", categoryController.getAllCategory);
  router.post("/api/createNewCategory", categoryController.createNewCategory);
  router.post("/api/updateCategory", categoryController.updateCategoryCRUD);

  //WhistList
  router.get("/api/get-wishlist", userController.getWishListByUserID); //wishlist
  router.post("/api/create-wishlist", userController.createWishlist); //create and updateupdate
  router.get("/api/delete-wishlist", userController.deleteWishlist);
  //ZaloPayment

  router.post("api/order", function (req, res) {
    const { item, description, amount } = req.body;
    const currentDate = dayjs();
    const app_time = currentDate.valueOf();
    const tranId = currentDate.format("YYMMDD");
    const app_trans_id = `${tranId}_${app_time}`;
    //https://docs.zalopay.vn/v2/docs/gateway/demo.html
    const key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";

    const data = {
      amount: amount,
      app_id: 2553,
      app_time: app_time,
      app_trans_id: app_trans_id,
      app_user: "demo",
      bank_code: "zalopayapp",
      description: description,
      embed_data: JSON.stringify({}),
      item: JSON.stringify({ items }),
      key1: key1,
      mac: "",
    };
    //https://docs.zalopay.vn/v2/general/overview.html#tao-don-hang
    //mac = HMAC(hmac_algorithm,key1,hmac_input)
    //hmac_input: app_id +”|”+ app_trans_id +”|”+ app_user +”|”+ amount +"|"+ app_time +”|”+ embed_data +"|"+ item
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
        //return_code:1 -> success
        //return_code2: fail
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

  return app.use("/", router);
};

module.exports = initWebRoutes;
