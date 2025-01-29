"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./documentation/swagger_output.json"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
const employees_1 = __importDefault(require("./routes/employees"));
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
app.use("/employees", employees_1.default
/*
#swagger.tags = ['EMPLOYEE']
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
