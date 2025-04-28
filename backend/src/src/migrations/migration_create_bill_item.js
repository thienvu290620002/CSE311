"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bill_Items", {
      // billItemId: DataTypes.STRING,
      // billId: DataTypes.STRING,
      // quanity: DataTypes.INTEGER,
      // productID: DataTypes.STRING,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      billItemId: {
        type: Sequelize.STRING,
      },
      billId: {
        type: Sequelize.STRING,
      },
      quanity: {
        type: Sequelize.INTEGER,
      },
      productId: {
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
    await queryInterface.dropTable("Bill_Items");
  },
};
