import db from "../models/index";
import ProductService from "../services/ProductService";

let getAllProduct = async (req, res) => {
  try {
    let data = await ProductService.getAllProduct();
    //console.log(data);
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
    let data = await ProductService.createNewProduct(req.body);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let deleteProductByID = async (req, res) => {
  try {
    // console.log(req.body.userId, "ssss");

    let data = await ProductService.deleteProductByID(req.query.productId);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let updateProduct = async (req, res) => {
  try {
    let data = req.body;
    //console.log(data);
    let allUser = await ProductService.updateProduct(data);
    return res.status(200).json(allUser);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let getProductById = async (req, res) => {
  try {
    const productId = req.query.id;

    // console.log(productId);

    let infor = await ProductService.getProductById(productId);
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
    //   console.log(req.body);

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
  getProductById: getProductById,
};
