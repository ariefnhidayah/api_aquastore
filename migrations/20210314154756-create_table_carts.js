"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("carts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      total_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addConstraint("carts", {
      type: "foreign key",
      name: "CARTS_PRODUCT_ID",
      fields: ["product_id"],
      references: {
        table: "products",
        field: "id",
      },
    });
    await queryInterface.addConstraint("carts", {
      type: "foreign key",
      name: "CARTS_USER_ID",
      fields: ["user_id"],
      references: {
        table: "users",
        field: "id",
      },
    });
    await queryInterface.addConstraint("carts", {
      type: "foreign key",
      name: "CARTS_SELLER_ID",
      fields: ["seller_id"],
      references: {
        table: "sellers",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("carts");
  },
};
