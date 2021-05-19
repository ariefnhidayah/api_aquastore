"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
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
      tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total_plus_tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      confirm_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.ENUM,
        values: ["pending", "paid", "expired", "challenge"],
        allowNull: false,
        defaultValue: "pending",
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      postcode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      snap_url: {
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

    await queryInterface.addConstraint("orders", {
      type: "unique",
      fields: ["code"],
      name: "UNIQUE_ORDERS_CODE",
    });

    await queryInterface.addConstraint("orders", {
      type: "foreign key",
      name: "ORDERS_PROVINCE_ID",
      fields: ["province_id"],
      references: {
        table: "provincies",
        field: "id",
      },
    });

    await queryInterface.addConstraint("orders", {
      type: "foreign key",
      name: "ORDERS_CITY_ID",
      fields: ["city_id"],
      references: {
        table: "cities",
        field: "id",
      },
    });

    await queryInterface.addConstraint("orders", {
      type: "foreign key",
      name: "ORDERS_DISTRICT_ID",
      fields: ["district_id"],
      references: {
        table: "districts",
        field: "id",
      },
    });

    await queryInterface.addConstraint("orders", {
      type: "foreign key",
      name: "ORDERS_USER_ID",
      fields: ["user_id"],
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("orders");
  },
};
