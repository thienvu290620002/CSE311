import bcrypt from "bcrypt";
import db from "../models/index";
import { raw } from "body-parser";
import { where } from "sequelize";
const fs = require("fs");
const path = require("path");
let createNewProduct = (data) => {
  // console.log(data);

  return new Promise(async (resolve, reject) => {
    try {
      //const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      await db.Product.create({
        // id: data.id,
        productId: data.productId,
        productName: data.productName,
        productPrice: data.productPrice,
        productStatus: data.productStatus,
        // productPrice: parseInt(data.productPrice), // Nếu là số
        descriptions: data.descriptions,
        size: data.size,
        image: data.image,
        // quantity: parseInt(data.quantity),
        quantity: data.quantity,
        categoryType: data.categoryType,
      });

      resolve("Ok create a new product successfull");
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
// let updateProduct = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let products = await db.Product.findOne({
//         where: { id: data.id },
//       });
//       if (products) {
//         products.productId = data.productId;
//         products.productName = data.productName;
//         products.productPrice = data.productPrice;
//         products.descriptions = data.descriptions;
//         products.size = data.size;
//         products.image = data.image;
//         products.quantity = data.quantity;
//         products.categoryType = data.categoryType;

//         await products.save();

//         let allProduct = await db.Product.findAll();
//         resolve(allProduct);
//       } else {
//         resolve({
//           errCode: 1,
//           errMessage: " Cannot find product",
//         });
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
// let updateProduct = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let product = await db.Product.findOne({
//         where: { id: data.id },
//       });

//       if (product) {
//         // Nếu có quantityToReduce, giảm quantity hiện tại
//         if (
//           data.quantityToReduce &&
//           typeof data.quantityToReduce === "number"
//         ) {
//           if (product.quantity >= data.quantityToReduce) {
//             product.quantity = product.quantity - data.quantityToReduce;
//           } else {
//             // Nếu số lượng tồn kho không đủ, trả về lỗi
//             return reject({
//               errCode: 2,
//               errMessage: "Insufficient product quantity in stock",
//             });
//           }
//         } else {
//           // Nếu không có quantityToReduce, cập nhật các trường còn lại như bình thường
//           product.productId = data.productId || product.productId;
//           product.productName = data.productName || product.productName;
//           product.productPrice = data.productPrice || product.productPrice;
//           product.descriptions = data.descriptions || product.descriptions;
//           product.size = data.size || product.size;
//           product.image = data.image || product.image;
//           product.quantity =
//             typeof data.quantity === "number"
//               ? data.quantity
//               : product.quantity;
//           product.categoryType = data.categoryType || product.categoryType;
//         }

//         await product.save();

//         let allProduct = await db.Product.findAll();
//         resolve(allProduct);
//       } else {
//         resolve({
//           errCode: 1,
//           errMessage: "Cannot find product",
//         });
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
let updateProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findOne({
        where: { productId: data.productId },
      });

      if (!product) {
        return resolve({
          errCode: 1,
          errMessage: "Cannot find product",
        });
      }
      product.productId = data.productId || product.productId;
      product.productName = data.productName || product.productName;
      product.productPrice = data.productPrice || product.productPrice;
      product.productStatus = data.productStatus || product.productStatus;
      product.descriptions = data.descriptions || product.descriptions;
      product.size = data.size || product.size;
      product.image = data.image || product.image;
      product.categoryType = data.categoryType || product.categoryType;

      if (data.quantity !== undefined && !isNaN(Number(data.quantity))) {
        product.quantity = Number(data.quantity);
      }
      // }
      // Cập nhật số lượng
      // if (data.quantity !== undefined && !isNaN(Number(data.quantity))) {
      //   if (data.isRestock) {
      //     product.quantity += Number(data.quantity); // cộng thêm
      //   } else {
      //     product.quantity = Number(data.quantity); // ghi đè
      //   }
      // }

      // Cập nhật trạng thái theo số lượng
      // product.productStatus = product.quantity <= 0 ? "outDate" : "onShop";

      await product.save();

      let allProduct = await db.Product.findAll();
      resolve(allProduct);
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

      let product = await db.Product.findOne({
        where: { id: productId },
      });

      if (!product) {
        return resolve({
          errCode: 2,
          errMessage: "Product not found",
        });
      }

      if (product.image) {
        const imagePath = path.join(__dirname, "..", "public", product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await product.destroy();

      return resolve({
        errCode: 0,
        errMessage: "Product deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getProductByProductId = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!productId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      }

      let product = await db.Product.findOne({
        where: { productId: productId },
      });

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

        resolve({
          errCode: 0,
          data: bill,
        });
      }
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
  getProductByProductId: getProductByProductId,
};
