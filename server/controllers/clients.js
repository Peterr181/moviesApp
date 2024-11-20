import Client from "../models/Client.js";
import Rental from "../models/Rental.js";

const handleError = (res, status, message) => {
  return res.status(status).json({ error: message });
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (err) {
    return handleError(res, 500, "Error fetching clients");
  }
};

export const addClient = async (req, res) => {
  const { firstName, lastName, email, address, phone } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !address || !phone) {
    return handleError(res, 400, "All fields are required");
  }

  try {
    const newClient = new Client({
      firstName,
      lastName,
      email,
      address,
      phone,
    });

    const savedClient = await newClient.save();
    return res.status(201).json(savedClient);
  } catch (err) {
    console.error("Error adding client:", err); // Add detailed error logging
    if (err.code === 11000) {
      return handleError(res, 400, "Email already exists");
    }
    return handleError(res, 500, "Error adding client");
  }
};

export const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedClient) return handleError(res, 404, "Client not found");
    return res.status(200).json(updatedClient);
  } catch (err) {
    return handleError(res, 500, "Error updating client");
  }
};

export const deleteClient = async (req, res) => {
  try {
    const activeRentals = await Rental.find({
      clientId: req.params.id,
      actualReturnDate: null,
    });

    if (activeRentals.length > 0) {
      return handleError(
        res,
        400,
        "Client has active rentals and cannot be deleted"
      );
    }

    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return handleError(res, 404, "Client not found");
    return res.status(200).json({ message: "Client deleted" });
  } catch (err) {
    return handleError(res, 500, "Error deleting client");
  }
};
