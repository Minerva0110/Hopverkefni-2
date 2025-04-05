import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { validate } from "../middleware/validate.js";
import { authenticate, isAdmin, AuthRequest } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";
import db from "../models/db.js";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const router = Router();

router.post("/register", authenticate, isAdmin, validate(registerSchema), async (req, res) => {
  const { username, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "user",
      },
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { username, password } = req.body;

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!user) {
      res.status(404).json({ error: "Notandi fannst ekki" });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Villa við að sækja notanda" });
  }
});


router.get("/user", authenticate, (req: AuthRequest, res) => {
  res.json({ message: `Welcome ${req.user?.username}, you are logged in as ${req.user?.role}` });
});

router.get("/admin", authenticate, isAdmin, (req: AuthRequest, res) => {
  res.json({ message: `Welcome Admin ${req.user?.username}` });
});

export default router;
