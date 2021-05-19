"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("districts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      city: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.addConstraint('districts', {
      type: 'foreign key',
      name: 'DISTRICTS_CITY_ID',
      fields: ['city'],
      references: {
        table: 'cities',
        field: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("districts");
  },
};
