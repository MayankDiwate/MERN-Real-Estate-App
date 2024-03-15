import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username) {
    return next(errorHandler(500, "Username is required"));
  } else if (!email) {
    return next(errorHandler(500, "Email is required"));
  } else if (!password) {
    return next(errorHandler(500, "Password is required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(errorHandler(500, "User already exists"));
  }

  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!email || !password) {
      return next(errorHandler(401, "All fields are required!"));
    }

    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, "Wrong password!"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    next(error);
  }
};
