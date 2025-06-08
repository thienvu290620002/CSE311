"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init(
    {
      title: DataTypes.STRING,
      date: DataTypes.DATE,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Blog",
    }
  );
  return Blog;
};
