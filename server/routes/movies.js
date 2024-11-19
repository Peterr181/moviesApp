import express from "express";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movies.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Movies Routes
router.get("/", verifyToken, getMovies); // List all movies with optional filters
router.post("/", verifyToken, addMovie); // Add a new movie
router.put("/:id", verifyToken, updateMovie); // Update movie details
router.delete("/:id", verifyToken, deleteMovie); // Delete a movie

export default router;
