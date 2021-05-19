"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_history", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
        comment:
          "0 => Pesanan baru, 1 => Pesanan dikirim, 2 => Pesanan selesai, 3 => Pesanan ditolak, 4 => Pesanan diproses, 5 => Pesanan dibatalkan",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    await queryInterface.addConstraint("order_history", {
      type: "foreign key",
      name: "ORDER_HISTORY_FOREIGN_KEY_INVOICE_ID",
      fields: ["invoice_id"],
      references: {
        table: "order_invoices",
        field: "id"
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("order_history");
  },
};

// comment:
// "0 => Pesanan baru, 1 => Pesanan dikirim, 2 => Pesanan selesai, 3 => Pesanan ditolak, 4 => Pesanan diproses, 5 => Pesanan dibatalkan",
