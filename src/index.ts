import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerOutPut from "./documentation/swagger_output.json";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import fs  from 'fs';

require("dotenv").config();

import blog from "./routes/blogs";
import user from "./routes/users";
import comment from "./routes/comments";

const db = process.env.MYBRAND_MONGODB_URI;
if (!db) {
  console.log("Can not read MongoDB string");
} else {
  mongoose
    .connect(db)
    .then(() => {
      console.log("Database successfully connected");
    })
    .catch((err: any) => {
      console.log("Database failed to connect:", err);
    });
}

const app = express();

app.use(morgan("dev"));
app.use(cors()); 

app.use(bodyParser.json({ limit: "50mb" })); 
app.use(bodyParser.urlencoded({ extended: false }));

const uploadDir = path.join(__dirname, "../uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

app.use(
  "/users",
  user
  /* 
#swagger.tags = ['USER']
*/
);
app.use(
  "/blogs",
  blog
  /* 
#swagger.tags = ['BLOG']
*/
);
app.use(
  "/comments",
  comment
  /* 
#swagger.tags = ['COMMENT']
*/
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutPut));

app.use("/", (req, res) => {
  res.send("Welcome to My Brand");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong! Error: ${err.message}`);
});

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

process.on("SIGINT", () => {
  console.log("Server shutting down...");
  server.close(() => {
    console.log("Server stopped");
    process.exit(0);
  });
});
