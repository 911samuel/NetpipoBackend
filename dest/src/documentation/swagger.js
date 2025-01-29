"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const apiDoc = {
  openapi: "3.0.0",
  info: {
    title: "NETPIPO BACKEND API DOCUMENTATION",
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
(0, swagger_autogen_1.default)({ openapi: "3.0.0" })(outputFilePath, endpointsFilePaths, apiDoc);
