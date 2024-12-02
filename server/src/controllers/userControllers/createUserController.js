const jwt = require("jsonwebtoken");
const { User, UserRole, UserCredentials } = require("../../db");
const bcrypt = require("bcrypt");
const { sendActivationEmail } = require("../../middlewares/sendActivationMail"); // Servicio de email

const createUser = async (userData) => {
  try {
    const { name, surname, birthdate, email, telephone, password, roleId } =
      userData;

    if (!name || !surname || !birthdate || !email || !telephone || !password) {
      return {
        error: true,
        response: "Faltan datos",
      };
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return {
        error: true,
        response: "El correo ya está registrado",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    let assignedRoleId = roleId;

    if (roleId) {
      const existingRole = await UserRole.findByPk(roleId);
      if (!existingRole) {

        assignedRoleId = null;
      }
    }

    if (!assignedRoleId) {
      const [defaultRole, created] = await UserRole.findOrCreate({
        where: { role_name: "customer" },
        defaults: {
          role_name: "customer",
        },
      });
      assignedRoleId = defaultRole.id;
    }

    const newUser = await User.create({
      name,
      surname,
      birthdate,
      email,
      telephone,
      isActive: false,
      isVerified: false,
      rolId: assignedRoleId,
    });

    // Crear credenciales de usuario
    await UserCredentials.create({
      UserId: newUser.id, // relación con el usuario recién creado
      username: newUser.email,
      password: hashedPassword, // guardar el password encriptado
    });

    // Generar token de activación
    const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Enviar correo de activación
    await sendActivationEmail(newUser.email, token);

    return newUser;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return {
      error: true,
      response: "Error al crear usuario.",
    };
  }
};

module.exports = {
  createUser,
};
