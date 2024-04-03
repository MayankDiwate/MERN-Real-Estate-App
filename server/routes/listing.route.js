import express from "express";
import {
  createListing,
  deleteListing,
  getAllListings,
  getListing,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/", verifyToken, getAllListings);
router.get("/:id", getListing);
router.post("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

export default router;
