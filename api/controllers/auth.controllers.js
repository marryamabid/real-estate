import User from "../models/user.model.js";
import errorhandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupController = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const bcryptSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json("user created successfully");
  } catch (error) {
    next(error);
  }
};
export const signinController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorhandler(404, "User not found"));
    }
    const isPasswordValid = await bcrypt.compare(password, validUser.password);
    if (!isPasswordValid) {
      return next(errorhandler(400, "Wrong credentials!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: _, ...userData } = validUser._doc; // Exclude password from user data
    res.status(200).cookie("token", token, { httpOnly: true }).json(userData);
  } catch (error) {
    next(errorhandler(error));
  }
};

export const googleController = async (req, res, next) => {
  const { username, email, profileImage } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: _, ...userData } = user._doc; // Exclude password from user data
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json(userData);
    } else {
      const newPassword = Math.random().toString(36).slice(-8); // Generate a random password
      const bcryptSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, bcryptSalt);
      const nameWithoutSpaces = username.split(" ").join("").toLowerCase(); // Generate a unique username
      const uniqueUsername =
        nameWithoutSpaces + Math.random().toString(36).slice(-5);
      const newUser = await User.create({
        username: uniqueUsername,
        email,
        password: hashedPassword,
        profileImage,
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: _, ...userData } = newUser._doc; // Exclude password from user data
      res.status(201).cookie("token", token, { httpOnly: true }).json(userData);
    }
  } catch (error) {
    console.log("Google Auth Error:", error);
    next(errorhandler(error));
  }
};
