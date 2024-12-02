require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, UserCredentials, UserRole } = require("../../db");

const secret = process.env.SECRET_KEY;

const loginUser = async (user, password) => {
  try {
    const userCredentials = await UserCredentials.findOne({
      where: { UserId: user.id },
    });
    if (!userCredentials) {
      return {
        error: true,
        response: "El usuario no existe",
      };
    }

    if (user.isDeleted) {
      return {
        deleted: true,
        error: true,
        response:
          "El usuario fue eliminado, contactese con el administrador del sitio",
      };
    }

    if (!user.isActive) {
      return {
        resendMail: true,
        error: true,
        response:
          "El usuario no se encuentra activo, verifique su casilla de correo para verificar su dirección de email",
      };
    }

    const isPasswordValid = bcrypt.compareSync(password, userCredentials.password);
    if (!isPasswordValid) {
      return {
        error: true,
        response: "Contraseña incorrecta",
      };
    }

    const userRole = await UserRole.findByPk(user.rolId);
    if (!userRole) {
      return {
        error: true,
        response: "Rol del usuario no encontrado",
      };
    }

    const dataForToken = {
      userId: user.id,
      username: `${user.name}`,
      userRole: userRole.role_name,
    };

    const tokenSession = jwt.sign(dataForToken, secret, { expiresIn: "2h" });

    return {
      login: true,
      tokenSession,
      userId: user.id,
      user: `${user.name}`,
      role: userRole.role_name
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      response: "Error interno del servidor",
    };
  }
};

module.exports = { loginUser };
