import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // Duration in minutes
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actors: {
    type: [String], // Array of actor names
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
