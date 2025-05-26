"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blog", {
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
      blogName: {
        type: Sequelize.STRING,
      },
      blogContent: {
        type: Sequelize.TEXT,
      },
      productID: {
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("blog");
  },
};
