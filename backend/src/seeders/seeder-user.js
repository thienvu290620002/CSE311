"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // email: DataTypes.STRING,
  // password: DataTypes.STRING,
  // firstName: DataTypes.STRING,
  // lastName: DataTypes.STRING,
  // address: DataTypes.STRING,
  // phoneNumber: DataTypes.STRING,
  // gender: DataTypes.BOOLEAN,
  // image: DataTypes.STRING,
  // roleId: DataTypes.STRING,
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        email: "admin@gmail.com",
        password: "111111",
        firstName: "Thanh",
        lastName: "Duy",
        address: "Chanh Phu Hoa",
        phoneNumber: "0843065055",
        gender: 1,
        image: "ROLL",
        roleId: "R1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
