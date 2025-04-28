import db from "../models/index";
import CategoryService from "../services/ProductService";
let getAllCategory = async (req, res) => {
  try {
    let data = await CategoryService.getAllCategory();
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
let createNewCategory = async (req, res) => {
  try {
    let data = await CategoryService.createNewCategory(req.body);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let updateCategoryCRUD = async (req, res) => {
  try {
    let data = req.body;
    //console.log(data);
    let allUser = await CategoryService.updateCategoryCRUD(data);
    return res.status(200).json(allUser);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

module.exports = {
  getAllCategory: getAllCategory,
  createNewCategory: createNewCategory,
  //   deleteUserCRUD: deleteUserCRUD,
  updateCategoryCRUD: updateCategoryCRUD,
};
