"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_products", {
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
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addConstraint("order_products", {
      type: "foreign key",
      name: "ORDER_PRODUCTS_PRODUCT_ID",
      fields: ["product_id"],
      references: {
        table: "products",
        field: "id",
      },
    });

    await queryInterface.addConstraint("order_products", {
      type: "foreign key",
      name: "ORDER_PRODUCTS_INVOICE_ID",
      fields: ["invoice_id"],
      references: {
        table: "order_invoices",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("order_products");
  },
};
