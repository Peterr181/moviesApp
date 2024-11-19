import Movie from "../models/Movie.js";
import Rental from "../models/Rental.js";

const handleError = (res, status, message) => {
  return res.status(status).json({ error: message });
};

// List all movies
export const getMovies = async (req, res) => {
  try {
    const { search, genre, sortBy } = req.query;

    const query = {};
    if (search) query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    if (genre) query.genre = genre;

    const sortOptions =
      sortBy === "rating" ? { rating: -1 } : { createdAt: -1 };

    const movies = await Movie.find(query).sort(sortOptions);
    return res.status(200).json(movies);
  } catch (err) {
    return handleError(res, 500, "Error fetching movies");
  }
};

// Add a new movie
export const addMovie = async (req, res) => {
  const { title, genre, director, duration, rating, description, actors } =
    req.body;

  try {
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie)
      return handleError(res, 400, "Movie with this title already exists");

    const newMovie = new Movie({
      title,
      genre,
      director,
      duration,
      rating,
      description,
      actors,
      createdAt: new Date(),
    });

    const savedMovie = await newMovie.save();
    return res.status(201).json(savedMovie);
  } catch (err) {
    return handleError(res, 500, "Error adding movie");
  }
};

// Modify movie details
export const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie) return handleError(res, 404, "Movie not found");
    return res.status(200).json(updatedMovie);
  } catch (err) {
    return handleError(res, 500, "Error updating movie");
  }
};

// Delete a movie
export const deleteMovie = async (req, res) => {
  try {
    const activeRentals = await Rental.find({
      movieId: req.params.id,
      returnedAt: null,
    });
    if (activeRentals.length > 0)
      return handleError(
        res,
        400,
        "Cannot delete a movie that is currently rented"
      );

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return handleError(res, 404, "Movie not found");
    return res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    return handleError(res, 500, "Error deleting movie");
  }
};
