import User from "../models/User.js";

const handleError = (res, status, message) => {
  return res.status(status).json({ error: message });
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password from response
    return res.status(200).json(users);
  } catch (err) {
    return handleError(res, 500, "Error fetching users");
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password"); // Exclude password
    if (!user) return handleError(res, 404, "User not found");
    return res.status(200).json(user);
  } catch (err) {
    return handleError(res, 500, "Error fetching user details");
  }
};

// Update a user (Profile update)
export const updateUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return handleError(res, 404, "User not found");
    return res.status(200).json(updatedUser);
  } catch (err) {
    return handleError(res, 500, "Error updating user");
  }
};

// Delete a user (Admin only or self-delete)
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return handleError(res, 404, "User not found");
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return handleError(res, 500, "Error deleting user");
  }
};

// Fetch logged-in user details
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password");
    if (!user) return handleError(res, 404, "User not found");
    return res.status(200).json(user);
  } catch (err) {
    return handleError(res, 500, "Error fetching user profile");
  }
};
