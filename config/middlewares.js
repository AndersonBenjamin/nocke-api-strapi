module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',             // Ambiente local (desenvolvimento)
        'https://localhost:3000',            // Caso esteja usando HTTPS local
        'https://nocke.com.br',              // Domínio principal institucional
        'https://www.nocke.com.br',          // Variante com www
        'https://nockeapp.com',              // Domínio do painel/app web
        'https://www.nockeapp.com',          // Variante com www
        'https://registro.nockeapp.com',     // Subdomínio exclusivo se usar (opcional)
        'capacitor://localhost',             // Capacitor (caso futuro para PWA)
        'ionic://localhost',                 // Ionic (se futuramente usar)
        'file://',
        'null',
        'app://localhost',
'https://app.nocke.com.br',
'http://app.nocke.com.br',
        'https://api.nockeapp.com'
      ],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'X-Requested-With',
        'Access-Control-Allow-Origin'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
