import bcrypt from "bcrypt";
import db from "../models/index";
import { raw } from "body-parser";
import { where } from "sequelize";
import user from "../models/user";

let createNewCategory = async (data) => {
  // console.log(data);

  return new Promise(async (resolve, reject) => {
    try {
      await db.Category.create({
        type: data.type,
        keyMap: data.keyMap,
      });

      resolve("Ok create a new category successfull");
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.Category.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let updateCategoryCRUD = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.Category.findOne({
        where: { id: data.id },
      });
      if (category) {
        category.type = data.type;
        category.keyMap = data.keyMap;

        await user.save();

        let getAllCategory = await db.Category.findAll();
        resolve(getAllCategory);
      } else {
        resolve({
          errCode: 1,
          errMessage: " Cannot find user",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewCategory: createNewCategory,
  getAllCategory: getAllCategory,
  updateCategoryCRUD: updateCategoryCRUD,
};
