import db from "../models/index";
import BillService from "../services/BillService";

let getAllBill = async (req, res) => {
  try {
    let bills = await BillService.getAllBill(); // ✅ Gọi đúng service
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: bills,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Something went wrong",
    });
  }
};
// let getAllBillItemWithRecommendation = async (req, res) => {
//   try {
//     let bills = await BillService.getAllBillItemWithRecommendation();
//     return res.status(200).json({
//       errCode: 0,
//       message: "OK",
//       data: bills,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       errCode: 1,
//       message: "Something went wrong",
//     });
//   }
// };
let getAllBillItemWithRecommendation = async (req, res) => {
  try {
    let result = await BillService.getAllBillItemWithRecommendation();
    if (result.errCode !== 0) {
      // Nếu service báo lỗi thì trả lỗi luôn
      return res.status(400).json(result);
    }
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in getAllBillItemWithRecommendation:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Something went wrong",
      error: error.message, // thêm để dễ debug
    });
  }
};

let getBillByUserID = async (req, res) => {
  try {
    let infor = await BillService.getBillByUserID(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: -1,
      errMessage: "Messge form sever",
    });
  }
};
let createBill = async (req, res) => {
  try {
    let data = await BillService.createBill(req.body);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in createBill:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let autoUpdateBillStatus = async (req, res) => {
  try {
    let result = await BillService.autoUpdateBillStatus();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error calling autoUpdateBillStatus from controller:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error during auto update",
      error: error.message,
    });
  }
};
let getCRUDBill = (req, res) => {
  return res.render("bill.ejs");
};

let updateBill = async (req, res) => {
  try {
    let data = req.body;
    //console.log(data);
    let allUser = await BillService.updateBill(data);
    return res.status(200).json(allUser);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let deleteBill = async (req, res) => {
  try {
    // console.log(req.body.userId, "ssss");
    let data = await BillService.deleteBill(req.body.userId);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

module.exports = {
  getAllBill: getAllBill,
  getBillByUserID: getBillByUserID,
  createBill: createBill,
  getCRUDBill: getCRUDBill,
  updateBill: updateBill,
  deleteBill: deleteBill,
  getAllBillItemWithRecommendation: getAllBillItemWithRecommendation,
  autoUpdateBillStatus: autoUpdateBillStatus,
};
