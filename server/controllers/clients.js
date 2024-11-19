import Client from "../models/Client.js";

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
  const { firstName, lastName, address, phone } = req.body;

  try {
    const newClient = new Client({
      firstName,
      lastName,
      address,
      phone,
    });

    const savedClient = await newClient.save();
    return res.status(201).json(savedClient);
  } catch (err) {
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
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return handleError(res, 404, "Client not found");
    return res.status(200).json({ message: "Client deleted" });
  } catch (err) {
    return handleError(res, 500, "Error deleting client");
  }
};
