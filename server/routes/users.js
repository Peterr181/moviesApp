import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
} from "../controllers/users.js";

import { verifyToken } from "../middlewares/authMiddleware.js"; // Middleware to verify JWT

const router = express.Router();

// Routes
router.get("/", verifyToken, getAllUsers); // Admin route to fetch all users
router.get("/profile", verifyToken, getProfile); // Logged-in user's profile
router.get("/:id", verifyToken, getUserById); // Admin or user-specific route
router.put("/:id", verifyToken, updateUser); // Update user info
router.delete("/:id", verifyToken, deleteUser); // Admin or self-delete route

export default router;
