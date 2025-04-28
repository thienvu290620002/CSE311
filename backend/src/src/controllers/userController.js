import db from "../models/index";
import UserService from "../services/UserService";

let getAllUser = async (req, res) => {
  try {
    let data = await UserService.getAllUser();
    //console.log(data);
    // return res.status(200).json(data);
    return res.render("displayCRUD.ejs", {
      dataTable: data,
    });
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let createNewUser = async (req, res) => {
  try {
    let data = await UserService.createNewUser(req.body);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let deleteUserCRUD = async (req, res) => {
  try {
    // console.log(req.body.userId, "ssss");

    let data = await UserService.deleteUserByID(req.body.userId);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let updateUserCRUD = async (req, res) => {
  try {
    let data = req.body;
    //console.log(data);
    let allUser = await UserService.updateUserData(data);
    return res.status(200).json(allUser);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let getBillByUserID = async (req, res) => {
  try {
    let infor = await UserService.getBillByUserID(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: -1,
      errMessage: "Messge form sever",
    });
  }
};

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  //console.log(email);

  if (!email || !password) {
    return res.status(500).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  let userData = await UserService.handleLogin(email, password);
  console.log(userData);

  // return res.status(200).json(infor);
  //check email exits
  //compare password
  //return userinfor
  //access token:JWT
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};
let getWishListByUserID = async (req, res) => {
  try {
    let infor = await UserService.getWishListByUserID(req.query.id);

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
    let data = await UserService.createBill(req.body);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let getCRUDBill = (req, res) => {
  return res.render("bill.ejs");
};
let createWishlist = async (req, res) => {
  try {
    let data = await UserService.createWishlist(req.body);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let deleteWishlist = async (req, res) => {
  try {
    // console.log(req.body.userId, "ssss");
    let data = await UserService.deleteWishlist(req.body);
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
  getAllUser: getAllUser,
  createNewUser: createNewUser,
  deleteUserCRUD: deleteUserCRUD,
  updateUserCRUD: updateUserCRUD,
  getBillByUserID: getBillByUserID,
  getWishListByUserID: getWishListByUserID,
  handleLogin: handleLogin,
  createBill: createBill,
  getCRUDBill: getCRUDBill,
  createWishlist: createWishlist,
  deleteWishlist: deleteWishlist,
};
