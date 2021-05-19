"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("seller_balances", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["request", "accepted", "rejected"],
        defaultValue: "request",
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      confirm_image:{
        type: Sequelize.STRING,
        allowNull: true
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("seller_balances", {
      type: "foreign key",
      name: "SELLER_BALANCES_SELLER_ID",
      fields: ["seller_id"],
      references: {
        table: "sellers",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("seller_balances");
  },
};
