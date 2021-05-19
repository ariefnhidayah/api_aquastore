"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("addresses", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      postcode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addConstraint('addresses', {
      type: 'foreign key',
      name: 'ADDRESSES_USER_ID',
      fields: ['user_id'],
      references: {
        table: 'users',
        field: 'id'
      }
    })

    await queryInterface.addConstraint('addresses', {
      type: 'foreign key',
      name: 'ADDRESSES_PROVINCE_ID',
      fields: ['province_id'],
      references: {
        table: 'provincies',
        field: 'id'
      }
    })

    await queryInterface.addConstraint('addresses', {
      type: 'foreign key',
      name: 'ADDRESSES_CITY_ID',
      fields: ['city_id'],
      references: {
        table: 'cities',
        field: 'id'
      }
    })

    await queryInterface.addConstraint('addresses', {
      type: 'foreign key',
      name: 'ADDRESSES_DISTRICT_ID',
      fields: ['district_id'],
      references: {
        table: 'districts',
        field: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addresses');
  },
};
