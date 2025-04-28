import express from "express";
import homeController from "../controllers/homeController";
import productController from "../controllers/productController";
import userController from "../controllers/userController";
import categoryController from "../controllers/categoryController";
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
  //Product
  router.get("/api/getAllProduct", productController.getAllProduct);
  router.post("/api/createNewProduct", productController.createNewProduct);
  router.get("/api/deleteProductByID", productController.deleteProductByID);
  router.post("/api/updateProduct", productController.updateProduct);
  //Category
  router.get("/api/getAllCategory", categoryController.getAllCategory);
  router.post("/api/createNewCategory", categoryController.createNewCategory);
  router.post("/api/updateCategory", categoryController.updateCategoryCRUD);
  //Bill User History
  router.get("/api/get-bill-by-user-id", userController.getBillByUserID); //history Cart

  //Create bill
  router.get("/api/crud-bill", userController.getCRUDBill);
  router.post("/api/create-bill", userController.createBill);
  //WhistList
  router.get("/api/get-wishlist", userController.getWishListByUserID); //wishlist
  router.post("/api/create-and-update-wishlist", userController.createWishlist); //create and updateupdate
  router.post("/api/delete-wishlist", userController.deleteWishlist);
  return app.use("/", router);
};

module.exports = initWebRoutes;
