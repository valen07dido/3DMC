import multer from "multer";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Configuración de almacenamiento de multer
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/", // Directorio donde se almacenarán los archivos
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para el archivo
    },
  }),
});

// Middleware para manejar la carga del archivo
const uploadMiddleware = upload.single("image");

// Usamos nextConnect para manejar el middleware
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Algo salió mal: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  },
});

apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res) => {
  const { name, email, message } = req.body;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "Debe subir una imagen" });
  }

  // Configuración de nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Asegúrate de configurar estas variables de entorno
      pass: process.env.GMAIL_PASS,
    },
  });

  // Configura el correo con el archivo adjunto
  const mailOptions = {
    from: email,
    to: "contacto@tupagina.com",
    subject: "Solicitud de Impresión 3D",
    text: `${message}\n\nDe: ${name} (${email})`,
    attachments: [
      {
        filename: file.filename,
        path: file.path,
      },
    ],
  };

  try {
    // Enviar correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
});

// Exporta la configuración según las nuevas convenciones
export const runtime = "nodejs"; // Para indicar que se usa Node.js como entorno
export default apiRoute;
