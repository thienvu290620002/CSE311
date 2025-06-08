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
// getAllBillItem
let getAllBillItemWithRecommendation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả hóa đơn kèm items và products
      let bills = await db.Bill.findAll({
        include: [
          {
            model: db.Bill_Item,
            as: "billItems",
            include: [
              {
                model: db.Product,
                as: "products",
                attributes: ["productId", "productName"], // Lấy ít thông tin sản phẩm cần thiết
              },
            ],
          },
        ],
        nest: true,
      });

      // Tạo một map để đếm số lần mua chung sản phẩm
      // key: productId, value: map của các productId khác và số lần mua chung
      let coPurchaseMap = {};

      // Duyệt qua từng bill để tính tần suất mua chung
      bills.forEach((bill) => {
        // Lấy danh sách productId của bill này
        let productIds = bill.billItems.map((item) => item.products.productId);

        // Với từng cặp sản phẩm trong cùng 1 hóa đơn, tăng count
        for (let i = 0; i < productIds.length; i++) {
          const p1 = productIds[i];
          if (!coPurchaseMap[p1]) coPurchaseMap[p1] = {};

          for (let j = 0; j < productIds.length; j++) {
            if (i === j) continue;
            const p2 = productIds[j];
            if (!coPurchaseMap[p1][p2]) coPurchaseMap[p1][p2] = 0;
            coPurchaseMap[p1][p2]++;
          }
        }
      });

      // Tạo kết quả recommend: với mỗi product, chọn sản phẩm được mua chung nhiều nhất
      let recommendations = {};
      for (let p1 in coPurchaseMap) {
        let maxCount = 0;
        let bestProduct = null;
        for (let p2 in coPurchaseMap[p1]) {
          if (coPurchaseMap[p1][p2] > maxCount) {
            maxCount = coPurchaseMap[p1][p2];
            bestProduct = p2;
          }
        }
        if (bestProduct !== null) {
          recommendations[p1] = bestProduct;
        }
      }

      resolve({
        errCode: 0,
        data: {
          bills,
          recommendations,
        },
      });
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
                      attributes: { exclude: ["quantity"] },
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

const generateBillId = () => {
  const short = Date.now().toString(36).slice(-6).toUpperCase();
  return `BILL-${short}`; // Ví dụ: BILL-7F5A3C
};

// let createBill = async (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const billDiscount = data.discount || 0;
//       let totalPrice = 0;

//       const customBillId = generateBillId();

//       // ✅ Tạo bill
//       let bill = await db.Bill.create({
//         billId: customBillId,
//         userId: data.userId,
//         paymentMethod: data.paymentMethod,
//         billStatus: "Delivered", // ✅ mặc định là Delivered
//         totalPrice: 0,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       for (let item of data.items) {
//         const product = await db.Product.findOne({
//           where: { productId: item.productId },
//         });

//         if (!product) {
//           console.log("⚠️ Product not found for ID:", item.productId);
//           continue;
//         }

//         // ✅ Kiểm tra số lượng tồn kho đủ hay không
//         if (product.quantity < item.quantity) {
//           return resolve({
//             errCode: 2,
//             errMessage: `Sản phẩm ${product.productName} không đủ số lượng tồn kho!`,
//           });
//         }

//         // ✅ Tính giá sau giảm giá
//         const itemTotalPrice = product.productPrice * item.quantity;
//         // console.log(itemTotalPrice);

//         const itemDiscount = item.discount || 0;
//         const itemDiscountedPrice =
//           itemTotalPrice - (itemTotalPrice * itemDiscount) / 100;

//         totalPrice += itemDiscountedPrice;

//         // ✅ Tạo bill item
//         await db.Bill_Item.create({
//           billId: customBillId,
//           billItemId: "ITEM-" + nanoid(8),
//           quantity: item.quantity,
//           productId: item.productId,
//           discount: billDiscount,
//           totalPrice: itemDiscountedPrice,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });

//         // ✅ Giảm số lượng tồn kho trong Product
//         product.quantity -= item.quantity;
//         await product.save();
//       }

//       bill.totalPrice = totalPrice;
//       await bill.save();

//       resolve({ message: "Bill created successfully", billId: customBillId });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
// let createBill = async (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const billDiscount = data.discount || 0;
//       let totalPrice = 0;

//       const customBillId = generateBillId();

//       // ✅ Thay đổi billStatus mặc định thành "Pending"
//       let bill = await db.Bill.create({
//         billId: customBillId,
//         userId: data.userId,
//         paymentMethod: data.paymentMethod,
//         billStatus: "Pending", // <--- THAY ĐỔI Ở ĐÂY
//         totalPrice: 0,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       // ... (phần còn lại của logic tạo bill item và cập nhật số lượng sản phẩm)

//       for (let item of data.items) {
//         const product = await db.Product.findOne({
//           where: { productId: item.productId },
//         });

//         if (!product) {
//           console.log("⚠️ Product not found for ID:", item.productId);
//           continue;
//         }

//         if (product.quantity < item.quantity) {
//           return resolve({
//             errCode: 2,
//             errMessage: `Sản phẩm ${product.productName} không đủ số lượng tồn kho!`,
//           });
//         }

//         const itemTotalPrice = product.productPrice * item.quantity;
//         const itemDiscount = item.discount || 0;
//         const itemDiscountedPrice =
//           itemTotalPrice - (itemTotalPrice * itemDiscount) / 100;

//         totalPrice += itemDiscountedPrice;

//         await db.Bill_Item.create({
//           billId: customBillId,
//           billItemId: "ITEM-" + nanoid(8),
//           quantity: item.quantity,
//           productId: item.productId,
//           discount: billDiscount,
//           totalPrice: itemDiscountedPrice,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });

//         product.quantity -= item.quantity;
//         await product.save();
//       }

//       bill.totalPrice = totalPrice;
//       await bill.save();

//       resolve({
//         errCode: 0,
//         message: "Bill created successfully",
//         billId: customBillId,
//       }); // Thêm errCode để đồng bộ với các response khác
//     } catch (e) {
//       console.error("Error creating bill:", e);
//       reject({
//         errCode: -1,
//         errMessage: "Error from Server during bill creation",
//       });
//     }
//   });
// };
let createBill = async (data) => {
  const t = await db.sequelize.transaction();
  // console.log(data);

  try {
    const billDiscount = data.discount || 0;
    let totalPrice = 0;
    const customBillId = generateBillId();

    let bill = await db.Bill.create(
      {
        billId: customBillId,
        userId: data.userId,
        paymentMethod: data.paymentMethod,
        billStatus: "Pending",
        totalPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );

    for (let item of data.items) {
      const product = await db.Product.findOne({
        where: { productId: item.productId },
        transaction: t,
        lock: t.LOCK.UPDATE, // tránh race condition
      });

      if (!product || product.quantity < item.quantity) {
        await t.rollback(); // Hủy bill nếu lỗi
        return {
          errCode: 2,
          errMessage: `Sản phẩm ${
            product?.productName || item.productId
          } không đủ số lượng tồn kho!`,
        };
      }

      const itemTotalPrice = product.productPrice * item.quantity;
      const itemDiscount = item.discount || 0;
      const itemDiscountedPrice =
        itemTotalPrice - (itemTotalPrice * itemDiscount) / 100;

      totalPrice += itemDiscountedPrice;

      await db.Bill_Item.create(
        {
          billId: customBillId,
          billItemId: "ITEM-" + nanoid(8),
          quantity: item.quantity,
          productId: item.productId,
          discount: billDiscount,
          totalPrice: itemDiscountedPrice,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction: t }
      );

      product.quantity -= item.quantity;
      await product.save({ transaction: t });
    }

    bill.totalPrice = totalPrice;
    await bill.save({ transaction: t });

    await t.commit();
    return {
      errCode: 0,
      message: "Bill created successfully",
      billId: customBillId,
    };
  } catch (e) {
    await t.rollback();
    console.error("Error creating bill:", e);
    return {
      errCode: -1,
      errMessage: "Error from Server during bill creation",
    };
  }
};

let autoUpdateBillStatus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả các hóa đơn có trạng thái "Pending"
      let pendingBills = await db.Bill.findAll({
        where: {
          billStatus: "Pending",
        },
        attributes: ["billId", "createdAt"], // Chỉ lấy billId và createdAt để kiểm tra
      });

      const now = new Date();
      let updatedCount = 0;

      for (let bill of pendingBills) {
        const createdAt = new Date(bill.createdAt);
        const timeDiff = now.getTime() - createdAt.getTime(); // Thời gian chênh lệch tính bằng miligiây

        // Nếu đã qua 1 phút (60000 miligiây)
        if (timeDiff >= 60000) {
          await db.Bill.update(
            { billStatus: "Delivered" },
            { where: { billId: bill.billId } }
          );
          updatedCount++;
          console.log(
            `Bill ${bill.billId} automatically updated to Delivered.`
          );
        }
      }
      resolve({
        errCode: 0,
        message: `Successfully updated ${updatedCount} bills.`,
        updatedCount: updatedCount,
      });
    } catch (e) {
      console.error("Error in autoUpdateBillStatus:", e);
      reject({
        errCode: -1,
        errMessage: "Error from server during auto update",
        error: e,
      });
    }
  });
};
const updateBill = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem hóa đơn có tồn tại không
      let bill = await db.Bill.findOne({
        where: { billId: data.billId },
      });
      // console.log(bill, "bills");

      if (!bill) {
        return reject({
          errCode: 1,
          errMessage: "Bill not found!",
        });
      }
      // Cập nhật thông tin hóa đơn, bao gồm cả billStatus nếu có trong data
      // const updatedBill = await bill.update({
      //   totalPrice: data.totalPrice,
      //   discount: data.discount || 0, // Nếu không có discount thì mặc định là 0
      //   ...(data.billStatus && { billStatus: data.billStatus }), // Cập nhật billStatus nếu có
      // });

      // Cập nhật các Bill_Item nếu có thay đổi
      // console.log(data);
      if (data.billStatus && data.billStatus === "Cancel") {
        const billItems = await db.Bill_Item.findAll({
          where: { billId: data.billId },
        });
        // console.log(billItems, "billItems");

        for (let item of billItems) {
          await db.Product.increment("quantity", {
            by: item.quantity,
            where: { productId: item.productId },
          });
        }

        await bill.update({ billStatus: "Cancel" });
        return resolve({
          errCode: 0,
          message: "Bill cancelled and product quantity restored.",
        });
      }

      if (data.items && data.items.length > 0) {
        for (let item of data.items) {
          let billItem = await db.Bill_Item.findOne({
            where: {
              billId: data.billId,
              productId: item.productId,
            },
          });
          // console.log(billItem, "items");

          if (billItem) {
            await billItem.update({
              quantity: item.quantity,
              discount: item.discount || 0,
              totalPrice: item.totalPrice || item.quantity * item.productPrice,
            });
          } else {
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

      resolve({ errCode: 0, message: "Bill updated successfully!" });
    } catch (e) {
      reject({
        errCode: -1,
        errMessage: e.message || "Error from server",
      });
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
  getAllBillItemWithRecommendation: getAllBillItemWithRecommendation,
  autoUpdateBillStatus: autoUpdateBillStatus,
};
