import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import listingRoute from "./routes/listing.route.js";
import userRoute from "./routes/user.route.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", [
    "http://localhost:5173",
    "https://mern-real-estate-app-beta.vercel.app",
  ]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://mern-real-estate-app-beta.vercel.app",
//     ],
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});
