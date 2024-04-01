import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
// router.get("/", getAllListings);
// router.get("/:id", getListing);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;
