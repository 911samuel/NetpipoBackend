"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./documentation/swagger_output.json"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
require("dotenv").config();
const blogs_1 = __importDefault(require("./routes/blogs"));
const users_1 = __importDefault(require("./routes/users"));
const comments_1 = __importDefault(require("./routes/comments"));
const db = process.env.BACKEND_MONGODB_URI;
if (!db) {
    console.log("❌ Can not read MongoDB string");
}
else {
    mongoose_1.default
        .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("✅ Database successfully connected"))
        .catch((err) => {
        console.log("❌ Database failed to connect:", err.message);
    });
}
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
const uploadDir = path_1.default.join(__dirname, "../uploads/");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
app.use("/uploads", express_1.default.static(uploadDir));
app.use("/users", users_1.default
/*
#swagger.tags = ['USER']
*/
);
app.use("/blogs", blogs_1.default
/*
#swagger.tags = ['BLOG']
*/
);
app.use("/comments", comments_1.default
/*
#swagger.tags = ['COMMENT']
*/
);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.use("/", (req, res) => {
    res.send("WELCOME TO NETPIPO BACKEND");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Something went wrong! Error: ${err.message}`);
});
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
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
