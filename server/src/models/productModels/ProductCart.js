const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("ProductCart", {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });
};
