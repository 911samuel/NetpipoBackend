import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerOutPut from "./documentation/swagger_output.json";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import fs from "fs";

require("dotenv").config();

import employee from "./routes/employees";

const db = process.env.BACKEND_MONGODB_URI;
if (!db) {
  console.log("❌ Can not read MongoDB string");
} else {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions)
    .then(() => console.log("✅ Database successfully connected"))
    .catch((err: any) => {
      console.log("❌ Database failed to connect:", err.message);
    });
}

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  "/employees",
  employee
  /* 
#swagger.tags = ['EMPLOYEE']
*/
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutPut));

app.use("/", (req, res) => {
  res.send("WELCOME TO NETPIPO BACKEND");
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
