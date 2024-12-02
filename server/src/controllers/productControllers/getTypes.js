const { ProductType } = require("../../db");

const getTypes = async () => {
  const types = await ProductType.findAll();

  if (!types || types.length === 0) {
    return {
      error: true,
      response: "No Existen tipos.",
    };
  }

  return types;
};

module.exports = { getTypes };