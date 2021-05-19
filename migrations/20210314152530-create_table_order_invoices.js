"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_invoices", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      shipping_cost: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      shipping_courier: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment:
          "0 => Pesanan baru, 1 => Pesanan dikirim, 2 => Pesanan selesai, 3 => Pesanan ditolak, 4 => Pesanan diproses, 5 => Pesanan dibatalkan",
      },
      receipt_number: {
        type: Sequelize.STRING,
        allowNull: true,
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

    await queryInterface.addConstraint("order_invoices", {
      type: "unique",
      fields: ["code"],
      name: "UNIQUE_CODE_ORDER_INVOICES",
    });

    await queryInterface.addConstraint("order_invoices", {
      type: "foreign key",
      name: "ORDER_INVOICE_ORDER_ID",
      fields: ["order_id"],
      references: {
        table: "orders",
        field: "id",
      },
    });

    await queryInterface.addConstraint("order_invoices", {
      type: "foreign key",
      name: "ORDER_INVOICE_SELLER_ID",
      fields: ["seller_id"],
      references: {
        table: "sellers",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("order_invoices");
  },
};
