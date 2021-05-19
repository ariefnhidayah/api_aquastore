'use strict';

const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('password', 10)
    await queryInterface.bulkInsert('admins', [{
      name: 'Admin',
      email: 'admin@admin.com',
      password: password,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admins', null, {});
  }
};
