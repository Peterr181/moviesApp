import express from "express";
import {
  getAllClients,
  addClient,
  updateClient,
  deleteClient,
} from "../controllers/clients.js";

const router = express.Router();

router.get("/", getAllClients);
router.post("/", addClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
