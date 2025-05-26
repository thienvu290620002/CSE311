import bcrypt from "bcrypt";
import db from "../models/index";

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
    console.log(data);
    try {
      // Check if the wishlist exists for this user
      let wishlist = await db.WishList.findOne({
        where: { userId: data.userId },
        raw: true,
      });

      console.log(wishlist, "aegdfbgnh");
      if (!wishlist) {
        wishlist = await db.WishList.create({
          userId: data.userId,
          productId: data.productId,
          wishListStatus: "active", // new wishlist = active
        });
      }
      console.log(wishlist, "aegáá123123123123dfbgnh");
      //   let wishlist2 = await db.WishList.findOne({
      //     where: { userId: data.userId },
      //     include: [
      //       {
      //         model: db.Product,
      //         as: "products",
      //       },
      //     ],
      //   });

      //   console.log(wishlist2, "lllll");
      // If no items were provided, delete the wishlist
      if (!data.items || data.items.length === 0) {
        if (wishlist) {
          await deleteWishlistIfEmpty(wishlist.wishListId);
        }
        return resolve("Empty wishlist. Wishlist deleted.");
      }

      // If not, create a new wishlist with status active

      let addedNewProduct = false;

      // Add the products to the wishlist
      for (let item of data.items) {
        const alreadyExists = wishlist.products.some(
          (product) => product.productId === item.productId
        );

        if (!alreadyExists) {
          await wishlist.addProduct(item.productId);
          addedNewProduct = true;
        }
      }

      // Nếu đã có wishlist và có thêm sản phẩm mới, cập nhật trạng thái active
      if (addedNewProduct && wishlist.wishListStatus !== "active") {
        await wishlist.update({ wishListStatus: "active" });
      }

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
  createWishlist: createWishlist,
  deleteWishlist: deleteWishlist,
};
