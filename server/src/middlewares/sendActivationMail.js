const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD, FRONTEND_URL } = process.env;

const sendActivationEmail = async (email, token) => {
  const activationLink = `${FRONTEND_URL}/activate/${token}`;
  const output = `
    <p>Gracias por registrarte. Por favor, activa tu cuenta haciendo clic en el enlace de abajo:</p>
    <a href="${activationLink}">Activar cuenta</a>
  `;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${EMAIL}`, // Tu correo electrónico
      pass: `${PASSWORD}`, // Tu contraseña
    },
  });

  let mailOptions = {
    from: `"Activación de cuenta" <${EMAIL}>`,
    to: `${email}`,
    subject: "Activa tu cuenta",
    html: output,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de activación enviado a %s", email);
  } catch (error) {
    console.log("Error enviando correo de activación: %s", error.message);
  }
};

module.exports = {
  sendActivationEmail,
};
