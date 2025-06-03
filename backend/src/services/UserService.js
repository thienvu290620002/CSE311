import bcrypt from "bcrypt";
import db from "../models/index";
import { raw } from "body-parser";
import { where } from "sequelize";
import user from "../models/user";

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
let createNewUser = async (data) => {
  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await db.User.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: true, message: "Email already exists" };
    }

    let hashPasswordFromBcrypt = await hashUserPassword(data.password);
    await db.User.create({
      email: data.email,
      password: hashPasswordFromBcrypt,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      image: data.image,
      roleId: data.roleId,
    });

    return { error: false, message: "Create new user successful" };
  } catch (e) {
    throw e;
  }
};
let hashUserPassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, salt); // Sử dụng async hàm bcrypt.hash
    return hashPassword;
  } catch (e) {
    throw e; // Ném lỗi nếu có
  }
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
        user.image = data.image;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.gender = data.gender;
        await user.save();

        let allUser = await db.User.findAll();
        resolve(allUser);
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
let deleteUserByID = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter: userId",
        });
        return;
      }
      console.log(userId);

      let user = await db.User.findOne({
        where: { id: userId },
      });

      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "User not found",
        });
      } else {
        await user.destroy();
        resolve({
          errCode: 0,
          errMessage: "User deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        //User Allready exist
        let user = await db.User.findOne({
          attributes: ["id", "email", "roleId", "password"],
          where: { email: email },
          raw: true,
          // attributes: {
          //   include: ["email", "roleId"],
          // },
        });
        if (user) {
          //Compare PassWord
          let check = await bcrypt.compareSync(password, user.password); //flase
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            console.log(user);

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong Password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User not found";
        }
      } else {
        //Return Error
        userData.errCode = 1;
        userData.errMessage = `Your email isn't exist in your system . Please try other email!`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
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
  handleLogin: handleLogin,
};
