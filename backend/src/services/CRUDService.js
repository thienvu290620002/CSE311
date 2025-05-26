import bcrypt from "bcrypt";
import db from "../models/index";
import { raw } from "body-parser";
import { where } from "sequelize";
import user from "../models/user";

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
let createNewUser = async (data) => {
  // console.log(data);

  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcryt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcryt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        image: data.image,
        roleId: data.roleId,
      });

      resolve("Ok create a new user successfull");
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
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
let getUserInforByID = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();

        let allUser = await db.User.findAll();
        resolve(allUser);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteUserByID = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await user.destroy();
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInforByID: getUserInforByID,
  updateUserData: updateUserData,
  deleteUserByID: deleteUserByID,
  getAllProduct: getAllProduct,
};
