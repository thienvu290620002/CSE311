import bcrypt from "bcrypt";
import db from "../models/index";
import { raw } from "body-parser";
import { where } from "sequelize";
import user from "../models/user";
import { nanoid } from "nanoid";
let getAllBill = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let bills = await db.Bill.findAll({
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
        nest: true,
      });
      resolve(bills);
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

// let createBill = async (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Lấy discount từ data, mặc định là 0 nếu không có
//       const billDiscount = data.discount || 0; // Discount toàn bộ hóa đơn

//       // Tính tổng giá trị bill trước khi áp dụng discount
//       let totalPrice = 0;

//       // Duyệt qua tất cả các item trong bill
//       for (let item of data.items) {
//         const product = await db.Product.findOne({
//           where: { productId: item.productId },
//         });

//         // Tính giá trị của sản phẩm
//         const itemTotalPrice = product.productPrice * item.quantity;

//         // Tính giá trị sau discount cho sản phẩm (ví dụ: 10% giảm giá cho từng sản phẩm)
//         const itemDiscount = item.discount || 0; // Nếu có discount riêng cho item
//         const itemDiscountedPrice =
//           itemTotalPrice - (itemTotalPrice * itemDiscount) / 100;

//         // Cộng vào tổng giá trị của hóa đơn
//         totalPrice += itemDiscountedPrice;

//         // Lưu Bill_Item với discount cho sản phẩm
//         await db.Bill_Item.create({
//           billId: data.billId,
//           productId: item.productId,
//           quantity: item.quantity,
//           discount: itemDiscount, // Lưu discount cho item vào Bill_Item
//           totalPrice: itemDiscountedPrice, // Lưu giá trị của sản phẩm sau discount
//         });
//       }

//       // Tạo hóa đơn chính với tổng giá trị đã được giảm giá từ các sản phẩm
//       let bill = await db.Bill.create({
//         billId: data.billId,
//         userId: data.userId,
//         totalPrice: totalPrice, // Tổng giá trị sau khi tính discount cho từng item
//         discount: billDiscount, // Lưu discount cho cả hóa đơn
//         date: createDate(),
//       });

//       resolve("Bill and bill items with discounts created successfully");
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const generateBillId = () => {
  const short = Date.now().toString(36).slice(-6).toUpperCase();
  return `BILL-${short}`; // Ví dụ: BILL-7F5A3C
};
let createBill = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const billDiscount = data.discount || 0;
      let totalPrice = 0;
      console.log(data.productId);

      const customBillId = generateBillId();

      // ✅ Tạo bill
      let bill = await db.Bill.create({
        billId: customBillId,
        userId: data.userId,
        paymentMethod: data.paymentMethod, // ✅ Đã sửa tên đúng
        totalPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // ✅ Tạo các bill item
      for (let item of data.items) {
        const product = await db.Product.findOne({
          where: { productId: item.productId },
        });

        if (!product) {
          console.log("⚠️ Product not found for ID:", item.productId);
          continue; // hoặc throw new Error để debug rõ hơn
        }
        const itemTotalPrice = product.productPrice * item.quantity;
        const itemDiscount = item.discount || 0;
        const itemDiscountedPrice =
          itemTotalPrice - (itemTotalPrice * itemDiscount) / 100;

        totalPrice += itemDiscountedPrice;

        await db.Bill_Item.create({
          billId: customBillId,
          billItemId: "ITEM-" + nanoid(8), // ✅ unique hơn
          quantity: item.quantity,
          productId: item.productId,
          discount: billDiscount,
          totalPrice: itemDiscountedPrice, // ✅ dùng giá trị đã tính
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      bill.totalPrice = totalPrice;
      await bill.save();

      resolve({ message: "Bill created successfully", billId: customBillId });
    } catch (e) {
      reject(e);
    }
  });
};

// let createBill = async (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const billDiscount = data.discount || 0;
//       let totalPrice = 0;

//       // console.log(data.id);

//       // Tạo billId custom
//       const customBillId = generateBillId();

//       // Tạo bill với custom billId
//       let bill = await db.Bill.create({
//         billId: customBillId, // Dùng ID custom
//         userId: data.userId,
//         paymentMedthod: data.paymentMedthod,
//         totalPrice: 0,
//       });

//       // Tạo bill items
//       for (let item of data.items) {
//         const product = await db.Product.findOne({
//           where: { productId: item.productId },
//         });

//         const itemTotalPrice = product.productPrice * item.quantity;
//         const itemDiscount = item.discount || 0;
//         const itemDiscountedPrice =
//           itemTotalPrice - (itemTotalPrice * itemDiscount) / 100;

//         totalPrice += itemDiscountedPrice;

//         await db.Bill_Item.create({
//           billId: customBillId,
//           itemId: `ITEM${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Hoặc bạn tự tạo logic riêng
//           quantity: item.quantity,
//           productId: item.productId,
//           discount: billDiscount,
//           totalPrice: itemDiscountedPrice,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }

//       // Cập nhật tổng tiền
//       bill.totalPrice = totalPrice;
//       await bill.save();

//       resolve({ message: "Bill created successfully", billId: customBillId });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

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

module.exports = {
  getAllBill: getAllBill,
  getBillByUserID: getBillByUserID,
  createBill: createBill,
  updateBill: updateBill,
  deleteBill: deleteBill,
};
