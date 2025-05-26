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

function createDate() {
  return new Date(); // returns current date and time as a Date object
}

let createBill = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy discount từ data, mặc định là 0 nếu không có
      const billDiscount = data.discount || 0; // Discount toàn bộ hóa đơn

      // Tính tổng giá trị bill trước khi áp dụng discount
      let totalPrice = 0;

      // Duyệt qua tất cả các item trong bill
      for (let item of data.items) {
        const product = await db.Product.findOne({
          where: { productId: item.productId },
        });

        // Tính giá trị của sản phẩm
        const itemTotalPrice = product.productPrice * item.quantity;

        // Tính giá trị sau discount cho sản phẩm (ví dụ: 10% giảm giá cho từng sản phẩm)
        const itemDiscount = item.discount || 0; // Nếu có discount riêng cho item
        const itemDiscountedPrice =
          itemTotalPrice - (itemTotalPrice * itemDiscount) / 100;

        // Cộng vào tổng giá trị của hóa đơn
        totalPrice += itemDiscountedPrice;

        // Lưu Bill_Item với discount cho sản phẩm
        await db.Bill_Item.create({
          billId: data.billId,
          productId: item.productId,
          quantity: item.quantity,
          discount: itemDiscount, // Lưu discount cho item vào Bill_Item
          totalPrice: itemDiscountedPrice, // Lưu giá trị của sản phẩm sau discount
        });
      }

      // Tạo hóa đơn chính với tổng giá trị đã được giảm giá từ các sản phẩm
      let bill = await db.Bill.create({
        billId: data.billId,
        userId: data.userId,
        totalPrice: totalPrice, // Tổng giá trị sau khi tính discount cho từng item
        discount: billDiscount, // Lưu discount cho cả hóa đơn
        date: createDate(),
      });

      resolve("Bill and bill items with discounts created successfully");
    } catch (e) {
      reject(e);
    }
  });
};

let updateBill = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem hóa đơn có tồn tại không
      let bill = await db.Bill.findOne({
        where: { billId: data.billId },
      });

      if (!bill) {
        return reject({
          errCode: 1,
          errMessage: "Bill not found!",
        });
      }

      // Cập nhật thông tin hóa đơn
      const updatedBill = await bill.update({
        totalPrice: data.totalPrice,
        discount: data.discount || 0, // Nếu không có discount thì mặc định là 0
      });

      // Cập nhật các Bill_Item nếu có thay đổi
      if (data.items && data.items.length > 0) {
        // Duyệt qua các item mới hoặc chỉnh sửa
        for (let item of data.items) {
          // Kiểm tra xem Bill_Item đã tồn tại chưa
          let billItem = await db.Bill_Item.findOne({
            where: {
              billId: data.billId,
              productId: item.productId,
            },
          });

          if (billItem) {
            // Nếu item đã có trong Bill_Item, cập nhật lại số lượng và giá trị
            await billItem.update({
              quantity: item.quantity,
              discount: item.discount || 0,
              totalPrice: item.totalPrice || item.quantity * item.productPrice, // Cập nhật giá trị sau giảm giá
            });
          } else {
            // Nếu chưa có item trong Bill_Item, tạo mới
            await db.Bill_Item.create({
              billId: data.billId,
              productId: item.productId,
              quantity: item.quantity,
              discount: item.discount || 0,
              totalPrice: item.totalPrice || item.quantity * item.productPrice,
            });
          }
        }
      }

      resolve("Bill updated successfully!");
    } catch (e) {
      reject(e);
    }
  });
};

let deleteBill = async (billId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem hóa đơn có tồn tại không
      let bill = await db.Bill.findOne({
        where: { billId: billId },
      });

      if (!bill) {
        return reject({
          errCode: 1,
          errMessage: "Bill not found!",
        });
      }

      // Xóa tất cả các Bill_Item liên quan đến hóa đơn
      await db.Bill_Item.destroy({
        where: { billId: billId },
      });

      // Xóa hóa đơn
      await bill.destroy();

      resolve("Bill and its items deleted successfully!");
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
                  model: db.Product,
                  as: "productWishLists",
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

const createWishlist = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the wishlist exists for this user
      let wishlist = await db.WishList.findOne({
        where: { userId: data.userId },
        include: [
          {
            model: db.Product,
            as: "products", // Use alias as defined in associations
          },
        ],
      });

      // If not, create a new wishlist
      if (!wishlist) {
        wishlist = await db.WishList.create({
          userId: data.userId,
        });
      }

      // If no items were provided, delete the wishlist
      if (!data.items || data.items.length === 0) {
        await deleteWishlistIfEmpty(wishlist.wishListId);
        return resolve("Empty wishlist. Wishlist deleted.");
      }

      // Add the products to the wishlist
      for (let item of data.items) {
        // Check if the product already exists in the wishlist
        if (
          !wishlist.products.some(
            (product) => product.productId === item.productId
          )
        ) {
          // Add product to wishlist
          await wishlist.addProduct(item.productId); // Using the generated many-to-many association method
        }
      }

      resolve("WishList updated successfully");
    } catch (e) {
      reject(e);
    }
  });
};

const deleteWishlistIfEmpty = async (wishListId) => {
  // Count the products associated with this wishlist
  const itemCount = await db.WishList.count({
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
  handleLogin: handleLogin,
  getBillByUserID: getBillByUserID,
  createBill: createBill,
  updateBill: updateBill,
  deleteBill: deleteBill,
  getWishListByUserID: getWishListByUserID,
  createWishlist: createWishlist,
};
