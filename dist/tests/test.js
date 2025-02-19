"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const employees_1 = __importDefault(require("../src/routes/employees"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/employees", employees_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Something went wrong! Error: ${err.message}`);
});
let employeeId;
let adminId;
let adminToken;
let employeeToken;
let blogId;
let id;
let commentId;
const employeeWithemployeeRole = {
    firstname: "mucyo",
    lastname: "Didier",
    employeename: "johndoe",
    email: "john@example.com",
    password: "password123",
};
const employeeWithemployeeRoleError = {
    firstname: "",
    lastname: "Didier",
    employeename: "",
    email: "john@example.com",
    password: "password123",
};
const employeeWithAdminRole = {
    firstname: "abayizera",
    lastname: "samuel",
    employeename: "samAbayizera",
    email: "abayizeraeaz@gmail.com",
    password: "password@123",
};
const mockBlog = {
    title: "here we go jugumilajhwdga",
    author: "John Doe",
    category: "Technology",
    description: "This is a sample blog description",
    imgUrl: "",
};
const mockUpdateBlog = {
    title: "Updated Sample Blog jugumilajhwdga",
    category: "Science",
    description: "This is the updated sample blog description",
    imgUrl: "/home/sam/Pictures/Screenshots/Screenshot from 2024-02-23 15-57-48.png",
};
const mockComment = {
    content: "This is a sample comment",
};
const mockUpdateComment = {
    content: "This is a sample comment",
};
const testingDbURI = process.env.TEST_MONGODB_URI;
beforeAll(async () => {
    if (!testingDbURI) {
        console.error("❌ TEST_MONGODB_URI is missing in .env");
        process.exit(1);
    }
    mongoose_1.default
        .connect(testingDbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("✅ Test Database Connected"))
        .catch((error) => {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    });
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe("employee Endpoints", () => {
    it("should register a employee with valid data", async () => {
        const response = await (0, supertest_1.default)(app)
            .post("/employees/signUp")
            .send(employeeWithemployeeRole);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("employeeWithoutPassword");
        employeeId = response.body.employeeWithoutPassword._id;
    });
    it("should return validation error when registering with invalid data", async () => {
        const invalidemployeeData = {
            employeename: "invalidemployeename123",
            email: "invalid@email",
            password: "s",
        };
        const response = await (0, supertest_1.default)(app)
            .post("/employees/signUp")
            .send(invalidemployeeData);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage", "Required");
    });
    it("should return error when registering with existing employeename", async () => {
        const response = await (0, supertest_1.default)(app)
            .post("/employees/signUp")
            .send(employeeWithemployeeRole);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "employeename is already taken");
    });
    it("should register an admin employee", async () => {
        const response = await (0, supertest_1.default)(app)
            .post("/employees/signUp")
            .send(employeeWithAdminRole);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("employeeWithoutPassword");
        adminId = response.body.employeeWithoutPassword._id;
    });
    it("GET /employee/all should get all registered employees", async () => {
        const res = await (0, supertest_1.default)(app).get("/employees/all");
        expect(res.status).toEqual(200);
    });
    it("GET  /employees/single/:id should return the requested employee profile", async () => {
        const res = await (0, supertest_1.default)(app).get(`/employees/single/${employeeId}`);
        expect(res.status).toEqual(200);
    });
    it("POST /employees/signIn should log in a employee", async () => {
        const response = await (0, supertest_1.default)(app).post("/employees/signIn").send({
            email: employeeWithAdminRole.email,
            password: employeeWithAdminRole.password,
        });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.employeeWithoutPassword._id).toBeTruthy();
        adminToken = response.body.token;
    });
    it("POST /employees/signIn should log in a employee", async () => {
        const response = await (0, supertest_1.default)(app).post("/employees/signIn").send({
            email: employeeWithemployeeRole.email,
            password: employeeWithemployeeRole.password,
        });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.employeeWithoutPassword._id).toBeTruthy();
        employeeToken = response.body.token;
    });
    it("POST /employees/signIn Invalid request", async () => {
        const response = await (0, supertest_1.default)(app).post("/employees/signIn").send({});
        expect(response.status).toBe(401);
    });
    it("POST /employees/signIn Invalid employee", async () => {
        const response = await (0, supertest_1.default)(app).post("/employees/signIn").send({
            employeename: "Simon@gmail.com",
            password: "Simon",
        });
        expect(response.status).toBe(401);
    });
    it("PUT /employees/update should update a employee", async () => {
        const response = await (0, supertest_1.default)(app)
            .put(`/employees/update/${employeeId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(employeeWithemployeeRole);
        expect(response.status).toBe(200);
    });
    it("should return validation error when updating employee with invalid data", async () => {
        const invalidemployeeData = {
            email: "notanemail",
        };
        const response = await (0, supertest_1.default)(app)
            .put(`/employees/update/${employeeId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidemployeeData);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("validationErrors");
    });
});
describe("Failed employee", () => {
    it("should handle error when fetching blogs", async () => {
        const res = await (0, supertest_1.default)(app).get("/employees/all1");
        expect(res.status).toEqual(404);
    });
});
describe("Delete employee Endpoints", () => {
    it("DELETE /employees/:id should delete a employee by ID", async () => {
        const response = await (0, supertest_1.default)(app)
            .delete(`/employees/delete/${employeeId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });
    it("DELETE /employees/deleteAll should delete all employees", async () => {
        const response = await (0, supertest_1.default)(app)
            .delete("/employees/deleteAll")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });
});
