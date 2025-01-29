"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employees_1 = require("../controllers/employees");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = (0, express_1.Router)();
router.post("/signUp", employees_1.signUp);
router.post("/signIn", employees_1.signIn);
router.get("/all", employees_1.all);
router.get("/single/:id", employees_1.single);
router.put("/update/:id", authenticate_1.default, employees_1.update);
router.delete("/delete/:id", authenticate_1.default, employees_1.delete1);
router.delete("/deleteAll", authenticate_1.default, employees_1.deleteAll);
exports.default = router;
