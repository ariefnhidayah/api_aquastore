"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_logs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      raw_response: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    await queryInterface.addConstraint("order_logs", {
      type: "foreign key",
      name: "ORDER_LOG_ORDER_ID",
      fields: ["order_id"],
      references: {
        table: "orders",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("order_logs");
  },
};
