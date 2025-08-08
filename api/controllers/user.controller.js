import User from "../models/user.model.js";
import errorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";

export const updateUserController = async (req, res, next) => {
  const { username, email, profileImage } = req.body;
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only update your own account"));
  }
  const updateFields = { username, email, profileImage };
  try {
    if (req.body.password) {
      const genSalt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, genSalt);
      updateFields.password = req.body.password; // Update password if provided
    }
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    );
    await updateUser.save();
    const { password: _, ...userDetails } = updateUser._doc;
    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      user: userDetails,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
