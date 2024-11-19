import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const saltRounds = 10;

const handleError = (res, status, message) => {
  return res.status(status).json({ error: message });
};

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    console.log("Signup request received:", { email, username, password });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered:", email);
      return handleError(res, 400, "Email already registered");
    }

    const hash = await bcrypt.hash(password.toString(), saltRounds);
    console.log("Password hashed successfully");

    const newUser = new User({
      email,
      username,
      password: hash,
    });

    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);

    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("JWT token generated:", token);

    return res.status(200).json({
      status: "Success",
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    return handleError(res, 500, "Internal Server Error");
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return handleError(res, 404, "User not found");

    const isMatch = await bcrypt.compare(password.toString(), user.password);
    if (!isMatch) return handleError(res, 401, "Invalid credentials");

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      status: "Success",
      message: "User logged in successfully",
      token,
    });
  } catch (err) {
    return handleError(res, 500, "Internal Server Error");
  }
};

export const logout = (req, res) => {
  return res.json({ status: "Success", message: "User logged out" });
};
