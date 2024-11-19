import express from "express";

const router = express.Router();

import { signup, signin } from "../controllers/auth.js";

router.get("/", (req, res) => {
  res.send("Hello from auth route");
});

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
