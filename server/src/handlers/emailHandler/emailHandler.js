const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD, EMAIL_RECEIVER, URL_FRONTEND } = process.env;

const PostMessage = (req, res) => {
 const {name,phone,email,Type,province,locality,message}=req.body
  const output = `
    <p>Tienes una nueva solicitud de contacto</p>
    <h3>Detalles del contacto</h3>
    <ul>
      <li>Nombre: ${name}</li>
      <li>Email: ${email}</li>
      <li>Telefono: ${phone}</li>
      <li>Tipo de negocio: ${Type}</li>
      <li>localidad: ${locality}</li>
      <li>provincia: ${province}</li>
    </ul>
    <h3>Mensaje</h3>
    <p>${message}</p>
  `;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${EMAIL}`, // Cambia esto por tu correo
      pass: `${PASSWORD}`, // Cambia esto por tu contraseña
    },
  });

  let mailOptions = {
    from: `"Solicitud de contacto" <${EMAIL}>`,
    to: `${EMAIL_RECEIVER}`,
    subject: "Nueva solicitud de contacto",
    html: output,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    res.send("Email ha sido enviado");
  });
};

module.exports={
    PostMessage
}