const nextConfig = {
  images: {
    domains: ["ethic.es", "res.cloudinary.com"],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.geojson$/,
      type: "json",
    });
    return config;
  },
  experimental: {
    appDir: true, // Si usas la carpeta `/app`
  },
  api: {
    bodyParser: true, // Asegura que se puedan procesar datos JSON en el backend
    externalResolver: true, // Permite que Next.js no maneje las respuestas automáticamente
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://tudominio.com" }, // Cambia esto si es necesario
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Authorization, Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
