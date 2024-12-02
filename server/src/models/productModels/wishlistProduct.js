const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("WishlistProduct", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  });
};
