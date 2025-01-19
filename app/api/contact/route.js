import multer from "multer";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Configuración de almacenamiento de multer
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/', // Directorio donde se almacenarán los archivos
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para el archivo
    },
  }),
});

// Utiliza next-connect para manejar el middleware
const handler = nextConnect();

// Configura el middleware de multer
handler.use(upload.single('image')); // 'image' es el campo del formulario para cargar la imagen

// Manejo del POST para el formulario
handler.post(async (req, res) => {
  const { name, email, message } = req.body;
  const { file } = req;

  // Configura el transporte de nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Tu correo electrónico en las variables de entorno
      pass: process.env.GMAIL_PASS, // La contraseña o un "app password"
    },
  });

  // Configura el correo con el archivo adjunto (si existe)
  const mailOptions = {
    from: email,
    to: 'contacto@tupagina.com',
    subject: 'Solicitud de Impresión 3D',
    text: message,
    attachments: file ? [
      {
        filename: file.filename,
        path: file.path,
      },
    ] : [],
  };

  try {
    // Enviar correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});

export { handler };
