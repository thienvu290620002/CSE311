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