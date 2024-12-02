const { User } = require("../../db");
const { loginUser } = require("../../controllers/userControllers/loginControllers");

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        error: true,
        response: "Usuario no encontrado",
      });
    }

    const result = await loginUser(user, password);
    if (result.error) {
      return res.status(400).json(result.response);
    }

    return res
      .status(200)
      .cookie("access-token", result.tokenSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      response: "Error en el servidor",
    });
  }
};

module.exports = { loginHandler };
