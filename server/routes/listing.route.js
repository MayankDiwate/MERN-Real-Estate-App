import express from "express";
import {
  createListing,
  deleteListing,
  getAllListings,
  getListing,
  getListings,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/", verifyToken, getAllListings);
router.get("/:id", getListing);
router.get("/get", getListings);
router.post("/update/:id", verifyToken, updateListing);
router.delete("delete/:id", verifyToken, deleteListing);

export default router;
