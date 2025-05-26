import db from "../models/index";
import WishListService from "../services/WishListService";

let createAndUpdateWishlist = async (req, res) => {
  // console.log(req.body);
  try {
    let data = await WishListService.createAndUpdateWishlist(req.body);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let getWishListByUserID = async (req, res) => {
  try {
    let infor = await WishListService.getWishListByUserID(req.query.id);

    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: -1,
      errMessage: "Messge form sever",
    });
  }
};
let deleteWishlist = async (req, res) => {
  try {
    // console.log(req.body.userId, "ssss");
    let data = await WishListService.deleteWishlist(req.body);
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
  getWishListByUserID: getWishListByUserID,
  createAndUpdateWishlist: createAndUpdateWishlist,
  deleteWishlist: deleteWishlist,
};
