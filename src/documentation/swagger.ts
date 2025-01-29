import swaggerAutogen from "swagger-autogen";

const apiDoc = {
  openapi: "3.0.0",
  info: {
    title: "MY BRAND API DOCUMENTATION",
    description: "Documentation for the Express API endpoints",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://my-express-app-yzv8.onrender.com",
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};

const outputFilePath = "./swagger_output.json";
const endpointsFilePaths = ["../index.ts"]; 

swaggerAutogen({ openapi: "3.0.0" })(
  outputFilePath,
  endpointsFilePaths,
  apiDoc
);
