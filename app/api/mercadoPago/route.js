// pages/api/payment-preference.js

import mercadopago from "mercadopago";

// Configura MercadoPago con tu access token
mercadopago.configurations.setAccessToken("algun token"); // Reemplaza con tu token

export async function handler(req, res) {
  if (req.method === "POST") {
    // Verifica que req.body.cart esté presente y sea un arreglo
    if (!req.body || !Array.isArray(req.body.cart)) {
      return res.status(400).json({ error: "El cuerpo de la solicitud está mal formado o falta el carrito." });
    }

    const preference = {
      items: req.body.cart.map((item) => ({
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      })),
      back_urls: {
        success: "http://www.your-site.com/success",  // Cambia a la URL correcta
        failure: "http://www.your-site.com/failure",  // Cambia a la URL correcta
        pending: "http://www.your-site.com/pending",  // Cambia a la URL correcta
      },
      auto_return: "approved",  // Esto garantiza que el usuario será redirigido tras el pago
    };

    try {
      // Crear preferencia de pago en MercadoPago
      const response = await mercadopago.preferences.create(preference);
      // Responder con el link de pago
      return res.status(200).json({ init_point: response.body.init_point });
    } catch (error) {
      console.error("Error al crear la preferencia de pago:", error);
      // En caso de error, devolver el mensaje de error
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Si la petición no es POST, devolver un error 405 (Método no permitido)
    return res.status(405).json({ error: "Método no permitido" });
  }
}
