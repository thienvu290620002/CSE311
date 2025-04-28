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
      WishList.hasMany(models.WishListItem, {
        foreignKey: "wishListId",
        sourceKey: "wishListId",
        as: "wishlistItems",
      });
    }
  }
  WishList.init(
    {
      wishListId: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "WishList",
    }
  );
  return WishList;
};
