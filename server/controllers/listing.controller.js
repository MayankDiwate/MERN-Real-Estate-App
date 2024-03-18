import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  const newListing = req.body;
  try {
    const listing = await Listing.create(newListing);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
