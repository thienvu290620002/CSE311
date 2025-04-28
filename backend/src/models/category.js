"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Allcode.hasMany(models.User,{foreignKey:"",as:""})
      //Allcode.hasMany(models.User, { foreignKey: "gender", as: "genderData" });
    }
  }
  Category.init(
    {
      type: DataTypes.STRING,
      keyMap: DataTypes.STRING,
      valueEN: DataTypes.STRING,
      valueVI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
    }
  );
  return Category;
};
