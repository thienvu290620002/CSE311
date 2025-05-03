import bcrypt from "bcrypt";
import db from "../models/index";
import { raw } from "body-parser";
import { where } from "sequelize";
import user from "../models/user";

let createNewProduct = async (data) => {
  // console.log(data);

  return new Promise(async (resolve, reject) => {
    try {
      await db.Product.create({
        productId: data.productId,
        productName: data.productName,
        productPrice: data.productPrice,
        descriptions: data.descriptions,
        size: data.size,
        image: data.image,
        quantity: data.quantity,
        categoryType: data.categoryType,
      });

      resolve("Ok create a new user successfull");
    } catch (e) {
      reject(e);
    }
  });
};

let getAllProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = await db.Product.findAll({
        raw: true,
      });
      resolve(products);
    } catch (e) {
      reject(e);
    }
  });
};

let getProductByCategory = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = await db.Product.findOne({
        where: { categoryType: categoryId },
      });
      if (products) {
        resolve(products);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};
let updateProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = await db.Product.findOne({
        where: { id: data.id },
      });
      if (products) {
        products.productId = data.productId;
        products.productName = data.productName;
        products.productPrice = data.productPrice;
        products.descriptions = data.descriptions;
        products.size = data.size;
        products.image = data.image;
        products.quantity = data.quantity;
        products.categoryType = data.categoryType;

        await products.save();

        let allProduct = await db.Product.findAll();
        resolve(allProduct);
      } else {
        resolve({
          errCode: 1,
          errMessage: " Cannot find product",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteProductByID = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!productId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter: productId",
        });
        return;
      }
      //  console.log(productId);

      let product = await db.Product.findOne({
        where: { id: productId },
      });

      if (!product) {
        resolve({
          errCode: 2,
          errMessage: "Product not found",
        });
      } else {
        await product.destroy();
        resolve({
          errCode: 0,
          errMessage: "Product deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getProductById = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!productId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      }

      //    console.log("Looking for product with ID:", productId);

      let product = await db.Product.findOne({
        where: { id: productId },
      });
      //   console.log(product);

      if (product) {
        resolve({ errCode: 0, data: product });
      } else {
        resolve({ errCode: 2, errMessage: "Product not found" });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProductByBillItem = (productId) => {
  return new Promise(async (resolve, reject) => {
    // console.log(productId);
    try {
      if (!productId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let product = await db.Bill_Item.findAll({
          where: { productId: productId },
          include: [
            {
              model: db.Product,
              as: "products",
            },
          ],
          nest: true,
        });

        resolve({
          errCode: 0,
          data: product,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getBillItemByBill = (billId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(billId);

      if (!billId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let bill = await db.Bill.findAll({
          where: { billId: billId },
          include: [
            {
              model: db.Bill_Item,
              as: "billItems",
            },
          ],

          nest: true,
        });

        // console.log(bill);
        resolve({
          errCode: 0,
          data: bill,
        });
      }
      //console.log(bill);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewProduct: createNewProduct,
  getAllProduct: getAllProduct,
  getProductByCategory: getProductByCategory,
  updateProduct: updateProduct,
  deleteProductByID: deleteProductByID,
  getProductByBillItem: getProductByBillItem,
  getBillItemByBill: getBillItemByBill,
  getProductById: getProductById,
};
