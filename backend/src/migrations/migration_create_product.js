"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      //   productId: DataTypes.INTEGER,
      //   productName: DataTypes.STRING,
      //   productPrice: DataTypes.INTEGER,
      //   description: DataTypes.TEXT,
      //  image: DataTypes.STRING,
      //   quantity: DataTypes.INTEGER,
      //   category: DataTypes.STRING,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      productName: {
        type: Sequelize.STRING,
      },
      productPrice: {
        type: Sequelize.INTEGER,
      },
      productStatus: {
        type: Sequelize.STRING,
      },
      descriptions: {
        type: Sequelize.TEXT,
      },
      size: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },

      quantity: {
        type: Sequelize.INTEGER,
      },
      categoryType: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
