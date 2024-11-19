import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  rentalDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    required: true, // Planned return date
  },
  actualReturnDate: {
    type: Date, // Null if not yet returned
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

export default Rental;
