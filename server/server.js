import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemRouter from './routers/itemRouter.js';
import cors from "cors";
import jwt from 'jsonwebtoken';
import path from "path";

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key"; // Moved to .env for security

// Hardcoded users
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" },
];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied" });
  }

  const token = authHeader.split(" ")[1]; // Assumes format "Bearer <token>"
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

// Login route
app.post("/api/v1/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, role: user.role });
});

// Example protected route for admin
app.get("/api/v1/admin-data", verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: "This is protected admin data." });
});

// Use router for handling specific routes
app.use('/api/v1/items', itemRouter);

app.use(express.static(path.join(__dirname,"/client/dist")));
app.get("*",(req, res) => {
  res.sendFile(path.resolve(__dirname,"client","dist","index.html"))
})
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

// Start the server with a default port fallback
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
