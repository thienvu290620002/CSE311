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
<<<<<<< HEAD
        targetKey: "productId",
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
        as: "productWishLists",
      });
    }
  }
  WishList.init(
    {
      userId: DataTypes.STRING,
      productId: DataTypes.STRING,
<<<<<<< HEAD
      wishListStatus: DataTypes.STRING,
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
    },
    {
      sequelize,
      modelName: "WishList",
    }
  );
  return WishList;
};
