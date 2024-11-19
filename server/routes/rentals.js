import express from "express";
import {
  getAllRentals,
  rentMovie,
  returnMovie,
} from "../controllers/rentals.js";

const router = express.Router();

// Get all rentals
router.get("/", getAllRentals);

// Rent a movie
router.post("/", rentMovie);

// Return a rented movie
router.put("/:rentalId/return", returnMovie);

export default router;
