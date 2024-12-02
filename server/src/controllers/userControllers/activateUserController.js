const jwt = require('jsonwebtoken');
const { User } = require("../../db");

const activateUserController = async (token) => {
  let decoded;
  try {
    // Verificamos y decodificamos el token
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return {
      error: true,
      response: "Token inválido o expirado"
    };
  }

  const user = await User.findByPk(decoded.id);

  if (!user) {
    return {
      error: true,
      response: "Usuario no encontrado"
    };
  }

  user.isActive = true;
  user.isVerified = true;
  await user.save();

  return {
    actived:true,
    response:"usuario activado con exito"
  }
};

module.exports = { activateUserController };
