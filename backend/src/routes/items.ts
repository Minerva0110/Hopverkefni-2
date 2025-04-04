import { Router } from "express";
import { getItems, getItemById, createItem, updateItem, deleteItem } from "../controllers/itemController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getItems); 
router.get("/:id", getItemById);
router.post("/", authenticate, createItem);
router.put("/:id", authenticate, updateItem);
router.delete("/:id", authenticate, deleteItem);

export default router;
