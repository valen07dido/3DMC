const mercadopago = require("mercadopago");

// Configura Mercado Pago con tu Access Token
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Exporta el manejador de la ruta como un endpoint de Next.js
export async function POST(req) {
  try {
    const body = await req.json(); // Parsear el cuerpo de la solicitud
    const { items } = body;


    // Configuración de la preferencia
    const preference = {
      items: items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "ARS",
        description: item.description.slice(0, 256), // Limitar a 256 caracteres
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_API_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_API_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_API_URL}/pending`,
      },
      auto_return: "approved",
    };

    // Crear preferencia
    const response = await mercadopago.preferences.create(preference);

    // Verifica si recibiste el init_point
    if (!response.body.init_point) {
      throw new Error("No se recibió init_point de Mercado Pago");
    }

    return new Response(JSON.stringify({ init_point: response.body.init_point }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la creación de la preferencia:", error.message);
    return new Response(
      JSON.stringify({ error: "Error al crear la preferencia de pago" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
