"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_1 = require("../controllers/comments");
const isemployee_1 = __importDefault(require("../middlewares/isemployee"));
const router = express_1.default.Router();
router.post("/add/:id", isemployee_1.default, comments_1.add);
router.put("/update/:id", isemployee_1.default, comments_1.update);
router.delete("/delete/:id", isemployee_1.default, comments_1.delete1);
router.delete("/deleteAll", isemployee_1.default, comments_1.deleteAll);
exports.default = router;
