'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'sellers', // table name
      'longitude', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
    await queryInterface.addColumn(
      'sellers', // table name
      'latitude', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sellers', 'longitude');
    await queryInterface.removeColumn('sellers', 'latitude');
  }
};
