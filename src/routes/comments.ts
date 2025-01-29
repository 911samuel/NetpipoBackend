import express from "express";
import { add, update, delete1, deleteAll } from "../controllers/comments";
import isemployee from "../middlewares/isemployee";

const router = express.Router();

router.post("/add/:id", isemployee, add);
router.put("/update/:id", isemployee, update);
router.delete("/delete/:id", isemployee, delete1);
router.delete("/deleteAll", isemployee, deleteAll);

export default router;
