"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bill_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bill_Item.belongsTo(models.Bill, {
        foreignKey: "billId",
        targetKey: "billId",
        as: "bills",
      });
      Bill_Item.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "products",
      });
    }
  }
  Bill_Item.init(
    {
      billItemId: DataTypes.STRING,
      billId: DataTypes.STRING,
      quanity: DataTypes.INTEGER,
      productId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Bill_Item",
    }
  );
  return Bill_Item;
};
