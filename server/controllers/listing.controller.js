import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  const newListing = req.body;
  const userId = req.user.id;
  try {
    const listing = await Listing.create({ ...newListing, userRef: userId });
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
