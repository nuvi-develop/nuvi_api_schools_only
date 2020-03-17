'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Students','io_count',{type:Sequelize.INTEGER})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Students','io_count')
  }
};
