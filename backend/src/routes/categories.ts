import { Router } from "express";
import { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", authenticate, isAdmin, createCategory);
router.put("/:id", authenticate, isAdmin, updateCategory);
router.delete("/:id", authenticate, isAdmin, deleteCategory);

export default router;
