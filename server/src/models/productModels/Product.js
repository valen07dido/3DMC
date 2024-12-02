const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Product", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    composition: {
      type: DataTypes.JSONB, 
      allowNull: false,
      defaultValue: [],
    },
    feedingGuide: {
      type: DataTypes.JSONB, 
      allowNull: false,
      defaultValue: [],
    },
    priceCategory: { // Nuevo campo para el filtro
      type: DataTypes.ENUM('Premium', 'Económico','Super Premium','Otro'), // ENUM para las categorías
      allowNull: false,
      defaultValue: "Otro",
    },
  });
};
