const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Music Room Booking API",
      version: "1.0.0",
      description: "API Documentation for the Music Room Booking Platform",
    },
    servers: [
      { url: "https://msroom.onrender.com/api" },
      { url: "http://localhost:4400/api" }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid"
        }
      }
    },
    security: [{ cookieAuth: [] }]
  },
  apis: ["./Routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
