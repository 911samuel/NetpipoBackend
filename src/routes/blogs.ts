import express, { Router } from "express";
import { all, single, create, update, delete1, deleteAll } from "../controllers/blogs";
import { upload } from "../middlewares/upload";
import authenticate from "../middlewares/authenticate";
import isAdmin from "../middlewares/isAdmin";

const router: Router = Router();

router.get("/all", all);
router.get("/single/:id", single);
router.post("/create", authenticate, isAdmin, upload, create);
router.put("/update/:id", authenticate, isAdmin, upload, update);
router.delete("/delete/:id", authenticate, isAdmin, delete1);
router.delete("/deleteAll", authenticate, isAdmin, deleteAll);

export default router;
