"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WishListItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WishListItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "productWishLists",
      });
      WishListItem.belongsTo(models.WishList, {
        foreignKey: "wishListId",
        targetKey: "wishListId",
        as: "wishlists",
      });
    }
  }
  WishListItem.init(
    {
      wishListId: DataTypes.STRING,
      productId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "WishListItem",
    }
  );
  return WishListItem;
};
