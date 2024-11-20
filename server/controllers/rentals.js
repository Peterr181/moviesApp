import Rental from "../models/Rental.js";
import Movie from "../models/Movie.js";
import Client from "../models/Client.js";

const handleError = (res, status, message) => {
  return res.status(status).json({ error: message });
};

// Get all rentals
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("clientId", "firstName lastName email")
      .populate("movieId", "title genre director")
      .sort({ rentedAt: -1 }); // Sort by most recent rentals

    return res.status(200).json(rentals);
  } catch (err) {
    return handleError(res, 500, "Error fetching rentals");
  }
};

// Rent a movie
export const rentMovie = async (req, res) => {
  const { clientId, movieId } = req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client)
      return handleError(res, 404, `Client not found with ID: ${clientId}`);

    const activeRentals = await Rental.find({
      clientId,
      actualReturnDate: null,
    });
    if (activeRentals.length >= 3)
      return handleError(res, 400, "Client has reached the rental limit");

    const movie = await Movie.findById(movieId);
    if (!movie || movie.isRented)
      return handleError(res, 400, "Movie is not available for rental");

    const rental = new Rental({
      clientId,
      movieId,
      rentalDate: new Date(),
      returnDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
    });

    await rental.save();

    // Mark movie as rented
    movie.isRented = true;
    await movie.save();

    return res.status(201).json(rental);
  } catch (err) {
    return handleError(res, 500, "Error processing rental");
  }
};

// Return a rented movie
export const returnMovie = async (req, res) => {
  const { rentalId } = req.params;

  try {
    const rental = await Rental.findById(rentalId);
    if (!rental || rental.returned)
      return handleError(res, 404, "Rental not found or already returned");

    // Mark the rental as returned
    rental.actualReturnDate = new Date();
    rental.returned = true;
    await rental.save();

    // Mark the movie as available
    const movie = await Movie.findById(rental.movieId);
    if (movie) {
      movie.isRented = false;
      await movie.save();
    }

    return res.status(200).json(rental);
  } catch (err) {
    return handleError(res, 500, "Error processing return");
  }
};
