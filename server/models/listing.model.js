import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    regularPrice: {
      type: Number,
      required: [true, "City is required"],
    },
    discountPrice: {
      type: Number,
      required: [true, "State is required"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Bathrooms are required"],
    },
    parking: {
      type: Number,
      required: [true, "Parking is required"],
    },
    furnished: {
      type: Boolean,
      required: [true, "Furnished is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    offer: {
      type: Boolean,
      required: [true, "Offer is required"],
    },
    imageUrls: {
      type: Array,
      required: [true, "Image Urls are required"],
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
