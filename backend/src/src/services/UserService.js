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

let getBillByUserID = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: inputId },
          attributes: { exclude: ["password", "image"] },
          include: [
            {
              model: db.Bill,
              as: "bills",
              include: [
                {
                  model: db.Bill_Item,
                  as: "billItems",
                  include: [
                    {
                      model: db.Product,
                      as: "products",
                    },
                  ],
                },
              ],
            },
          ],
          nest: true,
        });
        // console.log(user.bills[0].bill_item);

        resolve({
          errCode: 0,
          data: user,
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
          attributes: ["email", "roleId", "password"],
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
let getWishListByUserID = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: inputId },
          attributes: { exclude: ["password", "image"] },
          include: [
            {
              model: db.WishList,
              as: "wishlist",
              include: [
                {
                  model: db.WishListItem,
                  as: "wishlistItems",
                  include: [
                    {
                      model: db.Product,
                      as: "productWishLists",
                    },
                  ],
                },
              ],
            },
          ],
          nest: true,
        });
        // console.log(user.bills[0].bill_item);

        resolve({
          errCode: 0,
          data: user,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
function createDate() {
  return new Date(); // returns current date and time as a Date object
}
let createBill = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let bill = await db.Bill.create({
        billId: data.billId,
        userId: data.userId,
        totalPrice: data.totalPrice,
        date: createDate(),
      });

      for (let item of data.items) {
        await db.Bill_Item.create({
          billId: bill.billId,
          productId: item.productId,
          quanity: item.quanity,
        });
      }

      resolve("Bill and bill item created successfully");
    } catch (e) {
      reject(e);
    }
  });
};

const createWishlist = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem wishlist đã tồn tại cho user này chưa
      let wishlist = await db.WishList.findOne({
        where: { userId: data.userId },
      });

      // Nếu chưa tồn tại thì tạo mới
      if (!wishlist) {
        wishlist = await db.WishList.create({
          userId: data.userId,
        });
      }

      // Nếu data.items là mảng rỗng, gọi xóa wishlist và return sớm
      if (!data.items || data.items.length === 0) {
        await deleteWishlistIfEmpty(wishlist.wishListId);
        return resolve("Empty wishlist. Wishlist deleted.");
      }

      // Duyệt qua các item gửi từ frontend
      for (let item of data.items) {
        // Kiểm tra xem item đã tồn tại trong wishlist chưa
        const existingItem = await db.WishListItem.findOne({
          where: {
            wishListId: wishlist.wishListId,
            productId: item.productId,
          },
        });

        // Nếu chưa có thì thêm mới
        if (!existingItem) {
          await db.WishListItem.create({
            wishListId: wishlist.wishListId,
            productId: item.productId,
          });
        }
      }

      // Sau khi thêm item xong, kiểm tra lại nếu không có item nào thì xoá luôn wishlist
      //   await deleteWishlistIfEmpty(wishlist.wishListId);

      resolve("WishList updated successfully");
    } catch (e) {
      reject(e);
    }
  });
};

const deleteWishlistIfEmpty = async (wishListId) => {
  const itemCount = await db.WishListItem.count({
    where: { wishListId: wishListId },
  });

  if (itemCount === 0) {
    await db.WishList.destroy({
      where: { wishListId: wishListId },
    });
  }
};

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInforByID: getUserInforByID,
  updateUserData: updateUserData,
  deleteUserByID: deleteUserByID,
  getBillByUserID: getBillByUserID,
  handleLogin: handleLogin,
  getWishListByUserID: getWishListByUserID,
  createBill: createBill,
  createWishlist: createWishlist,
};
