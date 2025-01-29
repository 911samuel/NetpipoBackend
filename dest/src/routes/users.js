"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = (0, express_1.Router)();
router.post('/signUp', users_1.signUp);
router.post('/signIn', users_1.signIn);
router.get('/all', users_1.all);
router.get('/single/:id', users_1.single);
router.put('/update/:id', authenticate_1.default, users_1.update);
router.delete('/delete/:id', authenticate_1.default, users_1.delete1);
router.delete('/deleteAll', authenticate_1.default, users_1.deleteAll);
exports.default = router;
