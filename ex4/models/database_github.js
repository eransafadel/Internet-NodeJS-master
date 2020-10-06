'use strict';
module.exports = (sequelize, DataTypes) => {
  const DataBase_Github = sequelize.define('DataBase_Github', {
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  DataBase_Github.associate = function(models) {
    // associations can be defined here
  };
  return DataBase_Github;
};