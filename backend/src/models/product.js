"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Bill_Item, {
        foreignKey: "productId",
        as: "product",
      });
      Product.hasMany(models.WishList, {
        foreignKey: "productId",
        sourceKey: "productId",
        as: "wishLists",
      });
    }
  }
  Product.init(
    {
      productId: DataTypes.STRING,
      productName: DataTypes.STRING,
      productPrice: DataTypes.INTEGER,
      productStatus: DataTypes.STRING,
      descriptions: DataTypes.TEXT,
      size: DataTypes.STRING,
      image: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      categoryType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
