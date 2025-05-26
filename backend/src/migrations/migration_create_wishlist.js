"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WishLists", {
<<<<<<< HEAD
=======
    
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      userId: {
        type: Sequelize.STRING,
      },
      productId: {
<<<<<<< HEAD
        type: Sequelize.STRING,
      },
      wishListStatus: {
=======
>>>>>>> 92de85f5e845c27731c0f53f5cb90841135f08c8
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
    await queryInterface.dropTable("WishLists");
  },
};
