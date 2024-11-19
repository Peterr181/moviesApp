import express from "express";

const router = express.Router();

import { signup, signin, logout } from "../controllers/auth.js";

router.get("/", (req, res) => {
  res.send("Hello from auth route");
});

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

export default router;
