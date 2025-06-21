const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Codeforces Monitor API',
      version: '1.0.0',
      description: 'API documentation for Student Progress and Codeforces Monitor',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Scan route files for Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
