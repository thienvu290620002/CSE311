"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WishList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WishList.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      WishList.belongsTo(models.Product, {
        foreignKey: "productId",
        targetKey: "productId",
        as: "productWishLists",
      });
    }
  }
  WishList.init(
    {
      userId: DataTypes.STRING,
      productId: DataTypes.STRING,
      wishListStatus: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "WishList",
    }
  );
  return WishList;
};
