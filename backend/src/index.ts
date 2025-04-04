import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import items from "./routes/items.js"; 
import categoryRoutes from "./routes/categories.js";
import imageRoutes from "./routes/imageRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use("/items", items);
app.use("/categories", categoryRoutes);
app.use("/images", imageRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes); 


app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});
