"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sellers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      store_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "non-active"],
        allowNull: false,
        defaultValue: "non-active",
      },
      verification_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verification_sent_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      courier: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_holder: {
        type: Sequelize.STRING,
        allowNull: true,
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("sellers", {
      type: "unique",
      fields: ["email", "phone"],
      name: "UNIQUE_SELLERS_EMAIL_PHONE",
    });

    await queryInterface.addConstraint("sellers", {
      type: "foreign key",
      name: "SELLERS_PROVINCE_ID",
      fields: ["province_id"],
      references: {
        table: "provincies",
        field: "id",
      },
    });

    await queryInterface.addConstraint("sellers", {
      type: "foreign key",
      name: "SELLERS_CITY_ID",
      fields: ["city_id"],
      references: {
        table: "cities",
        field: "id",
      },
    });

    await queryInterface.addConstraint("sellers", {
      type: "foreign key",
      name: "SELLER_DISTRICT_ID",
      fields: ["district_id"],
      references: {
        table: "districts",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("sellers");
  },
};
