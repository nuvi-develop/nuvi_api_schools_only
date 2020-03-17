'use strict';
module.exports = (sequelize, DataTypes) => {
  const SupplyAndLeftAnalysis = sequelize.define('SupplyAndLeftAnalysis', {
    date: DataTypes.DATE,
    bld:DataTypes.STRING,
    food_supply: DataTypes.INTEGER,
    food_left: DataTypes.INTEGER,
    supply_time: DataTypes.TIME,
    left_time: DataTypes.TIME,
    photo_supply: DataTypes.STRING,
    photo_left: DataTypes.STRING,
  }, {});
  SupplyAndLeftAnalysis.associate = function(models) {
    //belongs to user
    SupplyAndLeftAnalysis.belongsTo(models.Student,{foreignKey:"studentUniqueNum" , targetKey:"uniqueNum"});
    //belongs To many food
    SupplyAndLeftAnalysis.belongsTo(models.Food);

    SupplyAndLeftAnalysis.belongsTo(models.Kiosk,{as:"kioskIn", foreignKey:"kioskInId"});

    SupplyAndLeftAnalysis.belongsTo(models.Kiosk,{as:"kioskOut",foreignKey:"kioskOutId"});
  };
  return SupplyAndLeftAnalysis;
};
