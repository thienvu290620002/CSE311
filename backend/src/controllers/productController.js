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
    // console.log("Request body:", req.body); // Log body
    // console.log("File uploaded:", req.file); // Log file upload

    // if (!req.file) {
    //   return res.status(400).json({ error: "No file uploaded" });
    // }
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

    // const productData = {
    //   ...req.body,
    //   image: `${req.protocol}://${req.get("host")}/uploads/${
    //     req.file.filename
    //   }`,
    // };

    let data = await ProductService.createNewProduct(req.body);
    console.log(data);

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
// let createNewProduct = async (req, res) => {
//   try {
//     // Xử lý đường dẫn ảnh
//     const processImage = (field) => {
//       if (req.files[field]) {
//         return `/uploads/${req.files[field][0].filename}`;
//       }
//       return null;
//     };

//     const productData = {
//       ...req.body,
//       image: processImage("image"),
//       image2: processImage("image2"),
//       image3: processImage("image3"),
//     };

//     let data = await ProductService.createNewProduct(productData);
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       errCode: -1,
//       errMessage: "Lỗi server khi tạo sản phẩm",
//     });
//   }
// };

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

let getProductByProductId = async (req, res) => {
  try {
    const productId = req.query.productId;
    console.log(productId);

    // console.log(productId);

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
  getProductByProductId: getProductByProductId,
};
