"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogs_1 = require("../controllers/blogs");
const upload_1 = require("../middlewares/upload");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const router = (0, express_1.Router)();
router.get("/all", blogs_1.all);
router.get("/single/:id", blogs_1.single);
router.post("/create", authenticate_1.default, isAdmin_1.default, upload_1.upload, blogs_1.create);
router.put("/update/:id", authenticate_1.default, isAdmin_1.default, upload_1.upload, blogs_1.update);
router.delete("/delete/:id", authenticate_1.default, isAdmin_1.default, blogs_1.delete1);
router.delete("/deleteAll", authenticate_1.default, isAdmin_1.default, blogs_1.deleteAll);
exports.default = router;
