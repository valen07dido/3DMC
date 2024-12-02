const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
   return sequelize.define("Cart", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM("inicializado", "finalizado"),
    },
    cartTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  });
};
