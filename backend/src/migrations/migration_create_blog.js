"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blogs", {
      // blogName: DataTypes.STRING,
      // blogContent: DataTypes.TEXT,
      // productID: DataTypes.INTEGER,
      //  image: DataTypes.STRING,
      // date: DataTypes.DATE,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      category: {
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
    await queryInterface.dropTable("blogs");
  },
};
