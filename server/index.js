import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import morgan from "morgan";
import dotenv from "dotenv";
import movieRoutes from "./routes/movies.js";
import clientRoutes from "./routes/clients.js";
import rentalRoutes from "./routes/rentals.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

// mongodb db

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("server running on port 8080"));
