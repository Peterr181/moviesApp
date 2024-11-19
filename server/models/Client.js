import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  rentals: {
    type: [mongoose.Schema.Types.ObjectId], // Array of rental IDs
    ref: "Rental",
  },
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
