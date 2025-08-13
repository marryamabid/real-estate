import Listing from "../models/listing.model.js";
import errorHandler from "../utils/errorHandler.js";
export const createController = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListingController = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    next(errorHandler(401, "No listing found"));
    return;
  }
  if (req.user.id !== listing.userRef) {
    next(errorHandler(401, "You can only delete your listing"));
    return;
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};
export const updataListingController = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    next(errorHandler(404, "Listing not found"));
    return;
  }
  console.log(listing);
  if (listing.userRef !== req.user.id) {
    next(errorHandler(401, "You can only update your listing"));
    return;
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedListing);
  } catch (error) {
    console.error(errorHandler(500, error.message));
  }
};
export const getListingController = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  try {
    res.status(200).json(listing);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
