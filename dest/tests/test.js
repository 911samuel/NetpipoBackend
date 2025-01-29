"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const users_1 = __importDefault(require("../src/routes/users"));
const blogs_1 = __importDefault(require("../src/routes/blogs"));
const comments_1 = __importDefault(require("../src/routes/comments"));
const fs_1 = __importDefault(require("fs"));
const blogs_2 = __importDefault(require("../src/models/blogs"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/users", users_1.default);
app.use("/blogs", blogs_1.default);
app.use("/comments", comments_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Something went wrong! Error: ${err.message}`);
});
let userId;
let adminId;
let adminToken;
let userToken;
let blogId;
let id;
let commentId;
const userWithUserRole = {
    firstname: "mucyo",
    lastname: "Didier",
    username: "johndoe",
    email: "john@example.com",
    password: "password123",
};
const userWithUserRoleError = {
    firstname: "",
    lastname: "Didier",
    username: "",
    email: "john@example.com",
    password: "password123",
};
const userWithAdminRole = {
    firstname: "abayizera",
    lastname: "samuel",
    username: "samAbayizera",
    email: "abayizeraeaz@gmail.com",
    password: "password@123",
};
const mockBlog = {
    title: "here we go jugumilajhwdga",
    author: "John Doe",
    category: "Technology",
    description: "This is a sample blog description",
    imgUrl: '',
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
    if (testingDbURI) {
        try {
            await mongoose_1.default.connect(testingDbURI);
        }
        catch (error) {
            console.error("Error connecting to MongoDB:", error);
        }
    }
    else {
        console.error("TEST_MONGODB_URI environment variable is not defined.");
    }
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe("User Endpoints", () => {
    it("should register a user with valid data", async () => {
        const response = await (0, supertest_1.default)(app)
            .post("/users/signUp")
            .send(userWithUserRole);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("userWithoutPassword");
        userId = response.body.userWithoutPassword._id;
    });
    it("should return validation error when registering with invalid data", async () => {
        const invalidUserData = {
            username: "invalidusername123",
            email: "invalid@email",
            password: "s",
        };
        const response = await (0, supertest_1.default)(app)
            .post("/users/signUp")
            .send(invalidUserData);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage", "Required");
    });
    it("should return error when registering with existing username", async () => {
        const response = await (0, supertest_1.default)(app)
            .post("/users/signUp")
            .send(userWithUserRole);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Username is already taken");
    });
    it("should register an admin user", async () => {
        const response = await (0, supertest_1.default)(app)
            .post("/users/signUp")
            .send(userWithAdminRole);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("userWithoutPassword");
        adminId = response.body.userWithoutPassword._id;
    });
    it("GET /user/all should get all registered users", async () => {
        const res = await (0, supertest_1.default)(app).get("/users/all");
        expect(res.status).toEqual(200);
    });
    it("GET  /users/single/:id should return the requested user profile", async () => {
        const res = await (0, supertest_1.default)(app).get(`/users/single/${userId}`);
        expect(res.status).toEqual(200);
    });
    it("POST /users/signIn should log in a user", async () => {
        const response = await (0, supertest_1.default)(app).post("/users/signIn").send({
            email: userWithAdminRole.email,
            password: userWithAdminRole.password,
        });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.userWithoutPassword._id).toBeTruthy();
        adminToken = response.body.token;
    });
    it("POST /users/signIn should log in a user", async () => {
        const response = await (0, supertest_1.default)(app).post("/users/signIn").send({
            email: userWithUserRole.email,
            password: userWithUserRole.password,
        });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.userWithoutPassword._id).toBeTruthy();
        userToken = response.body.token;
    });
    it("POST /users/signIn Invalid request", async () => {
        const response = await (0, supertest_1.default)(app).post("/users/signIn").send({});
        expect(response.status).toBe(401);
    });
    it("POST /users/signIn Invalid user", async () => {
        const response = await (0, supertest_1.default)(app).post("/users/signIn").send({
            username: "Simon@gmail.com",
            password: "Simon",
        });
        expect(response.status).toBe(401);
    });
    it("PUT /users/update should update a user", async () => {
        const response = await (0, supertest_1.default)(app)
            .put(`/users/update/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(userWithUserRole);
        expect(response.status).toBe(200);
    });
    it("should return validation error when updating user with invalid data", async () => {
        const invalidUserData = {
            email: "notanemail",
        };
        const response = await (0, supertest_1.default)(app)
            .put(`/users/update/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidUserData);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("validationErrors");
    });
});
describe("Failed user", () => {
    it("should handle error when fetching blogs", async () => {
        const res = await (0, supertest_1.default)(app).get("/users/all1");
        expect(res.status).toEqual(404);
    });
});
describe("Blog Endpoints", () => {
    it("POST /blogs/create should create new blog", async () => {
        const filePath = path_1.default.join(__dirname, "36ia6lcrj85.png");
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error("Test file not found");
        }
        const response = await (0, supertest_1.default)(app)
            .post("/blogs/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .field("imgUrl", fs_1.default.createReadStream(filePath))
            .field("title", mockBlog.title)
            .field("description", mockBlog.description)
            .field("author", mockBlog.author)
            .field("category", mockBlog.category);
        expect(response.status).toEqual(201);
        blogId = response.body.blog._id;
    });
    it("POST /blogs/create should return 401 without token", async () => {
        const res = await (0, supertest_1.default)(app).post("/blogs/create").send(mockBlog);
        expect(res.status).toEqual(401);
    });
    it("GET /blogs/all should fetch all blogs", async () => {
        const response = await (0, supertest_1.default)(app)
            .get("/blogs/all")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toEqual(200);
    });
    it("GET /blogs/all should handle errors when fetching blogs", async () => {
        jest.spyOn(blogs_2.default, "find").mockRejectedValue(new Error("Database error"));
        const response = await (0, supertest_1.default)(app)
            .get("/blogs/all")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("error", "An error occurred while fetching blogs");
    });
    it("GET /blogs/single/:id should fetch a single blog", async () => {
        const response = await (0, supertest_1.default)(app)
            .get(`/blogs/single/${blogId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toEqual(200);
    });
    it("GET /blogs/single/:id should handle case when an error occurs", async () => {
        jest.spyOn(blogs_2.default, "findById").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const existingId = "existing-id";
        const response = await (0, supertest_1.default)(app)
            .get(`/blogs/single/${existingId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("error", "An error occurred while fetching the blog");
    });
    it("PUT /blogs/update/:id should update a blog", async () => {
        const response = await (0, supertest_1.default)(app)
            .put(`/blogs/update/${blogId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(mockUpdateBlog);
        expect(response.status).toEqual(200);
    });
    it("PUT /users/update/:id should return 401 without admin token", async () => {
        const res = await (0, supertest_1.default)(app)
            .put(`/users/update/${userId}`)
            .send(userWithUserRole);
        expect(res.status).toEqual(401);
    });
    it("PUT /users/update/:id should return 404 without wrong url", async () => {
        const res = await (0, supertest_1.default)(app).put("/users/update").send(userWithUserRole);
        expect(res.status).toEqual(404);
    });
    it("should return validation error when creating blog with invalid data", async () => {
        const invalidBlogData = {
            category: "",
            title: "",
        };
        const response = await (0, supertest_1.default)(app)
            .post("/blogs/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidBlogData);
        expect(response.status).toBe(400);
    });
    it("should return validation error when updating blog with invalid data", async () => {
        const invalidBlogData = {
            title: "",
            description: "",
        };
        const response = await (0, supertest_1.default)(app)
            .put(`/blogs/update/${blogId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidBlogData);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("Title is required");
    });
    it("should return validation error when creating blog with invalid data", async () => {
        const invalidBlogData = {
            category: "",
            title: "",
        };
        const response = await (0, supertest_1.default)(app)
            .post("/blogs/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidBlogData);
        expect(response.status).toBe(400);
    });
    it("should return validation error when updating blog with invalid data", async () => {
        const invalidBlogData = {
            title: "",
            content: "",
        };
        const response = await (0, supertest_1.default)(app)
            .put(`/blogs/update/${blogId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidBlogData);
        expect(response.status).toBe(400);
    });
});
describe("Comment Endpoints", () => {
    it("POST /comments/add/:id should add a new comment", async () => {
        const response = await (0, supertest_1.default)(app)
            .post(`/comments/add/${blogId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(mockComment);
        expect(response.status).toBe(201);
        commentId = response.body.comment._id;
    });
    it("POST /comments/add/:id should return 400 with validation errors", async () => {
        const invalidData = {
            content: "",
        };
        const response = await (0, supertest_1.default)(app)
            .post(`/comments/add/${blogId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(invalidData)
            .expect(500);
    });
    it("PUT /comments/update/:id should update a comment", async () => {
        const response = await (0, supertest_1.default)(app)
            .put(`/comments/update/${commentId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(mockUpdateComment);
        expect(response.status).toEqual(200);
    });
    it("PUT /comments/update/:id should return 500 if comment not found", async () => {
        const invalidCommentId = "invalidId";
        const response = await (0, supertest_1.default)(app)
            .put(`/comments/update/${invalidCommentId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(mockUpdateComment)
            .expect(500);
    });
});
describe("Delete Comment Endpoints", () => {
    it("DELETE /comments/delete/:id should delete a comment by ID", async () => {
        const response = await (0, supertest_1.default)(app)
            .delete(`/comments/delete/${commentId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    });
    it("DELETE /comments/delete/:id should return 500 if comment not found", async () => {
        const invalidCommentId = "invalidId";
        const response = await (0, supertest_1.default)(app)
            .delete(`/comments/delete/${invalidCommentId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(500);
    });
    it("DELETE /comments/deleteAll should delete all comments", async () => {
        const response = await (0, supertest_1.default)(app)
            .delete("/comments/deleteAll")
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    });
});
describe("Delete Blog Endpoints", () => {
    it("DELETE /blogs/delete/:id should delete a blog by ID", async () => {
        const response = await (0, supertest_1.default)(app)
            .delete(`/blogs/delete/${blogId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });
    it("DELETE /blogs/deleteAll should delete all blogs", async () => {
        const response = await (0, supertest_1.default)(app)
            .delete("/blogs/deleteAll")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });
});
describe("Delete User Endpoints", () => {
    it("DELETE /users/:id should delete a user by ID", async () => {
        const response = await (0, supertest_1.default)(app)
            .delete(`/users/delete/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });
    it("DELETE /users/deleteAll should delete all users", async () => {
        const response = await (0, supertest_1.default)(app)
            .delete("/users/deleteAll")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });
});
