import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import request from "supertest";
import bodyParser from "body-parser";
import morgan from "morgan";
import employeeRoutes from "../src/routes/employees";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/employees", employeeRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong! Error: ${err.message}`);
});

const employeeData = {
  firstname: "John",
  lastname: "Doe",
  employeename: "johndoe",
  email: "john@example.com",
  password: "password123",
};

let employeeId: string;
let employeeToken: string;

const testingDbURI = process.env.TEST_MONGODB_URI;

beforeAll(async () => {
  if (!testingDbURI) {
    console.error("❌ TEST_MONGODB_URI is missing in .env");
    process.exit(1);
  }

  await mongoose.connect(testingDbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Employee Endpoints", () => {
  it("should register an employee", async () => {
    const response = await request(app)
      .post("/employees/signUp")
      .send(employeeData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("employeeWithoutPassword");
    employeeId = response.body.employeeWithoutPassword._id;
  });

  it("should not register an employee with invalid data", async () => {
    const invalidData = {
      email: "invalidemail",
      password: "123",
    };

    const response = await request(app)
      .post("/employees/signUp")
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errorMessage", "Required");
  });

  it("should login an employee", async () => {
    const response = await request(app).post("/employees/signIn").send({
      email: employeeData.email,
      password: employeeData.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.employeeWithoutPassword._id).toBeTruthy();
    employeeToken = response.body.token;
  });

  it("should fail login with incorrect credentials", async () => {
    const response = await request(app).post("/employees/signIn").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
  });

  it("should fetch employee profile", async () => {
    const response = await request(app)
      .get(`/employees/single/${employeeId}`)
      .set("Authorization", `Bearer ${employeeToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", employeeId);
  });

  it("should update an employee", async () => {
    const response = await request(app)
      .put(`/employees/update/${employeeId}`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({ firstname: "UpdatedName" });

    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe("UpdatedName");
  });

  it("should return validation error when updating with invalid data", async () => {
    const response = await request(app)
      .put(`/employees/update/${employeeId}`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({ email: "invalidemail" });

    expect(response.status).toBe(400);
  });

  it("should delete an employee", async () => {
    const response = await request(app)
      .delete(`/employees/delete/${employeeId}`)
      .set("Authorization", `Bearer ${employeeToken}`);

    expect(response.status).toBe(200);
  });

  it("should fail to fetch deleted employee", async () => {
    const response = await request(app)
      .get(`/employees/single/${employeeId}`)
      .set("Authorization", `Bearer ${employeeToken}`);

    expect(response.status).toBe(404);
  });
});
