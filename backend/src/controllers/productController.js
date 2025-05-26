import db from "../models/index";
import ProductService from "../services/ProductService";

let getAllProduct = async (req, res) => {
  try {
    let data = await ProductService.getAllProduct();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let createNewProduct = async (req, res) => {
  try {
    if (
      !req.body.productName ||
      !req.body.productPrice ||
      !req.body.descriptions ||
      !req.body.size ||
      !req.body.quantity ||
      !req.body.categoryType ||
      !req.body.image
    ) {
      return res.status(400).json({ error: "Thiếu thông tin sản phẩm" });
    }
    if (parseInt(req.body.quantity) <= 0) {
      req.body.productStatus = "outDate";
    } else {
      req.body.productStatus = "onShop";
    }

    let data = await ProductService.createNewProduct(req.body);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi server khi tạo sản phẩm",
    });
  }
};
let updateProduct = async (req, res) => {
  try {
    let data = req.body;

    if (parseInt(data.quantity) <= 0) {
      data.productStatus = "outDate";
    } else {
      data.productStatus = "onShop";
    }

    let allUser = await ProductService.updateProduct(data);
    return res.status(200).json(allUser);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let deleteProductByID = async (req, res) => {
  try {
    let data = await ProductService.deleteProductByID(req.query.productId);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let getProductByProductId = async (req, res) => {
  try {
    const productId = req.query.productId;

    let infor = await ProductService.getProductByProductId(productId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: -1,
      errMessage: "Message from server",
    });
  }
};

let getProductByBillItem = async (req, res) => {
  try {
    let infor = await ProductService.getProductByBillItem(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: -1,
      errMessage: "Messge form sever",
    });
  }
};

let getBillItemByBill = async (req, res) => {
  try {
    let infor = await ProductService.getBillItemByBill(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: -1,
      errMessage: "Messge form sever",
    });
  }
};

module.exports = {
  getAllProduct: getAllProduct,
  createNewProduct: createNewProduct,
  updateProduct: updateProduct,
  deleteProductByID: deleteProductByID,
  getProductByBillItem: getProductByBillItem,
  getBillItemByBill: getBillItemByBill,
  getProductByProductId: getProductByProductId,
};
