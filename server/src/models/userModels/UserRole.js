const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "UserRole",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.ENUM,
        values: ["admin", "customer"],
        defaultValue: "customer",
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
