"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: ''
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      seo_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addConstraint('products', {
      type: 'foreign key',
      name: 'PRODUCT_CATEGORY_ID',
      fields: ['category_id'],
      references: {
        table: 'categories',
        field: 'id'
      }
    })

    await queryInterface.addConstraint('products', {
      type: 'foreign key',
      name: 'PRODUCT_SELLER_ID',
      fields: ['seller_id'],
      references: {
        table: 'sellers',
        field: 'id'
      }
    })

    await queryInterface.addConstraint('products', {
      type: 'unique',
      fields: ['seo_url'],
      name: "UNIQUE_PRODUCTS_SEO_URL"
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("products");
  },
};
