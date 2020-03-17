'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Students','rank_percent',{
      type:Sequelize.FLOAT
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Students','rank_percent')
  }
};
