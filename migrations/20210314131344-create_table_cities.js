"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cities", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      province: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postcode: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });

    await queryInterface.addConstraint('cities', {
      type: 'foreign key',
      name: 'CITIES_PROVINCE_ID',
      fields: ['province'],
      references: {
        table: 'provincies',
        field: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cities");
  },
};
