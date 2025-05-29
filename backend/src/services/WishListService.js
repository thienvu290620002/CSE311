import bcrypt from "bcrypt";
import db from "../models/index";

// let getWishListByUserID = (inputId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!inputId) {
//         resolve({
//           errCode: 1,
//           errMessage: "Missing required parameter!",
//         });
//       } else {
//         let user = await db.User.findOne({
//           where: { id: inputId },
//           attributes: { exclude: ["password", "image"] },
//           include: [
//             {
//               model: db.WishList,
//               as: "wishlist",
//               include: [
//                 {
//                   model: db.Product,
//                   as: "productWishLists",
//                 },
//               ],
//             },
//           ],
//           nest: true,
//         });
//         // console.log(user.bills[0].bill_item);

//         resolve({
//           errCode: 0,
//           data: user,
//         });
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
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
              where: { wishListStatus: "active" },
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

const createAndUpdateWishlist = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data, "checkcheck");
    try {
      // Check if the wishlist exists for this user
      let wishlist = await db.WishList.findOne({
        where: { userId: data.userId, productId: data.productId },
        // raw: true,
      });

      console.log(wishlist, "da coco");
      if (!wishlist) {
        wishlist = await db.WishList.create({
          userId: data.userId,
          productId: data.productId,
          wishListStatus: "active", // new wishlist = active
        });
      } else {
        wishlist.wishListStatus = data.wishListStatus;
        await wishlist.save();
      }
      console.log(wishlist, "save");

      resolve("WishList updated successfully");
    } catch (e) {
      reject(e);
    }
  });
};

const deleteWishlist = async (wishListId) => {
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
  getWishListByUserID: getWishListByUserID,
  createAndUpdateWishlist: createAndUpdateWishlist,
  deleteWishlist: deleteWishlist,
};
