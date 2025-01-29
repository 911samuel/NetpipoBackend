"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_1 = require("../controllers/comments");
const isUser_1 = __importDefault(require("../middlewares/isUser"));
const router = express_1.default.Router();
router.post('/add/:id', isUser_1.default, comments_1.add);
router.put('/update/:id', isUser_1.default, comments_1.update);
router.delete('/delete/:id', isUser_1.default, comments_1.delete1);
router.delete('/deleteAll', isUser_1.default, comments_1.deleteAll);
exports.default = router;
