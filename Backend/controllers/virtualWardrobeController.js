const ClothingItem = require("../models/virtualWardrobeModel");
const OutfitItem = require("../models/outfitModel");

//  UPLOAD CLOTH
exports.uploadItem = async (req, res) => {
  try {
    console.log("Received cloth upload:", req.body);

    const {
      name,
      image,
      category,
      clothType,
      color,
      material,
      season,
      brand,
      occasion,
    } = req.body;

    if (
      !image ||
      !category ||
      !clothType ||
      !color ||
      !material ||
      !season.length ||
      !brand.length ||
      !occasion.length
    ) {
      console.log("Missing fields");
      return res.status(400).json({
        message:
          "All fields are required, including at least one season and occasion.",
      });
    }

    const newClothingItem = new ClothingItem({
      name,
      image,
      category,
      clothType,
      color,
      material,
      season,
      brand,
      occasion,
    });

    await newClothingItem.save();
    console.log("Saved to MongoDB:", newClothingItem);

    return res.status(201).json({ success: "success", data: newClothingItem });
  } catch (err) {
    console.error("Error in uploadItem:", err);
    return res.status(500).json({
      success: "failed",
      message: err.message || "Internal server error",
    });
  }
};
// GET ALL CLOTHES
exports.getAllClothes = async (req, res) => {
  try {
    let clothes = await ClothingItem.find();

    return res.status(200).json({
      status: "succes",
      data: clothes,
      noOfProducts: clothes.length,
    });
  } catch (err) {
    return res.status(400).json({ status: "failed", message: err.message });
  }
};

// GET CLOTH BY ID
exports.getClothById = async (req, res) => {
  try {
    let id = req.params.id;
    let cloth = await ClothingItem.find({ _id: id });

    res.status(201).json({ status: "success", data: cloth });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const { field, value } = req.body; // ✅ Extract field and value from request body
    const id = req.params.id;

    // ✅ Define valid fields
    const arrayFields = ["occasion", "season"]; // Fields that should be arrays
    const stringFields = ["color", "clothType", "category"]; // Fields that should be strings
    const validFields = [...arrayFields, ...stringFields];

    // ✅ Validate if field is allowed
    if (!validFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field provided" });
    }

    // ✅ Find clothing item in MongoDB
    const cloth = await ClothingItem.findById(id);
    if (!cloth) {
      return res.status(404).json({ message: "Clothing item not found" });
    }

    // ✅ Handle `occasion` and `season` as arrays
    if (arrayFields.includes(field)) {
      if (!Array.isArray(value)) {
        return res
          .status(400)
          .json({ message: `Field '${field}' expects an array.` });
      }

      // Ensure no duplicate values are added
      cloth[field] = [...new Set([...cloth[field], ...value])]; // ✅ Merge & remove duplicates
    }
    // ✅ Handle `color`, `clothType`, `category` as strings
    else if (stringFields.includes(field)) {
      if (Array.isArray(value)) {
        return res.status(400).json({
          message: `Field '${field}' expects a string, not an array.`,
        });
      }
      cloth[field] = value; // ✅ Update string field directly
    }

    await cloth.save(); // ✅ Save changes to MongoDB

    res
      .status(200)
      .json({ message: "Field updated successfully", data: cloth });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating field", error: err.message });
  }
};

// DELETE CLOTH'S TAG
exports.deleteTag = async (req, res) => {
  try {
    const { field, valueToRemove } = req.body; // ✅ Extract field and value to remove
    const id = req.params.id; // ✅ Extract clothing item ID

    // ✅ Allow deletion only for array fields (occasion, season)
    if (!["occasion", "season"].includes(field)) {
      return res.status(400).json({ message: "Invalid field for tag removal" });
    }

    // ✅ Find clothing item
    const cloth = await ClothingItem.findById(id);
    if (!cloth) {
      return res.status(404).json({ message: "Clothing item not found" });
    }

    // ✅ Ensure field is an array
    if (!Array.isArray(cloth[field])) {
      return res
        .status(400)
        .json({ message: `Field '${field}' is not an array` });
    }

    // ✅ Prevent deletion if only one tag remains
    if (cloth[field].length <= 1) {
      return res.status(400).json({
        message: `You can't delete this item. You need at least one ${field}.`,
      });
    }

    // ✅ Remove the specified value from the array
    const updatedField = cloth[field].filter((tag) => tag !== valueToRemove);

    // ✅ If no changes were made (tag was not found)
    if (cloth[field].length === updatedField.length) {
      return res
        .status(400)
        .json({ message: `'${valueToRemove}' not found in ${field}.` });
    }

    cloth[field] = updatedField; // ✅ Update field

    await cloth.save(); // ✅ Save changes to MongoDB

    res.status(200).json({
      message: `Successfully removed '${valueToRemove}' from ${field}`,
      data: cloth,
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting tag", error: err.message });
  }
};

// DELETE CLOTH
exports.deleteCloth = async (req, res) => {
  try {
    let id = req.params.id;
    await ClothingItem.findByIdAndDelete(id);
    res.status(200).json({ status: "succes", message: "Deleted succesfully." });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

// OUTFIT

// SAVE OUTFIT
exports.createOutfit = async (req, res) => {
  try {
    const { name, outfitItems, occasion, season, imageUrl } = req.body;

    // Ensure fullBody is properly structured
    if (!outfitItems?.fullBody) {
      return res
        .status(400)
        .json({
          error: "Full body outfit (onePiece or twoPiece) is required.",
        });
    }

    // Check for at least one valid clothing selection
    const hasOnePiece =
      outfitItems.fullBody.onePiece && outfitItems.fullBody.onePiece.length > 0;
    const hasTwoPiece =
      outfitItems.fullBody.twoPiece?.top?.length > 0 &&
      outfitItems.fullBody.twoPiece?.bottom?.length > 0;

    if (!hasOnePiece && !hasTwoPiece) {
      return res
        .status(400)
        .json({
          error:
            "Either onePiece or both top and bottom in twoPiece must be provided.",
        });
    }

    // Ensure footwear is provided
    if (!outfitItems.footwear || outfitItems.footwear.length === 0) {
      return res
        .status(400)
        .json({ error: "Footwear is required for an outfit." });
    }

    // Create new outfit document
    const newOutfit = new OutfitItem({
      name,
      outfitItems,
      occasion,
      season,
      imageUrl,
    });

    // Save to database
    const savedOutfit = await newOutfit.save();
    res
      .status(201)
      .json({ message: "Outfit created successfully", outfit: savedOutfit });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error saving outfit", error: error.message });
  }
};

// GET ALL OUTFITS
exports.getAllOutfits = async (req, res) => {
  try {
    let outfits = await OutfitItem.find();

    return res.status(200).json({
      status: "succes",
      data: outfits,
      noOfProducts: outfits.length,
    });
  } catch (err) {
    return res.status(400).json({ status: "failed", message: err.message });
  }
};

// GET OUTFIT BY ID

exports.getOutfitById = async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch the outfit by ID
    const outfit = await OutfitItem.findById(id);

    // Handle case where the outfit is not found
    if (!outfit) {
      return res
        .status(404)
        .json({ status: "failed", message: "Outfit not found" });
    }

    // Return the outfit if found
    res.status(200).json({ status: "success", data: outfit });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

// DELETE OUTFIT

exports.deleteOutfit = async (req, res) => {
  try {
    let id = req.params.id;
    await OutfitItem.findByIdAndDelete(id);
    res.status(200).json({ status: "succes", message: "Deleted succesfully." });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.deleteCloth = async (req, res) => {
  try {
    // Extract the cloth ID from the request parameters
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ status: "failed", message: "Cloth ID is required" });
    }

    // Attempt to delete the clothing item by its ID
    const deletedCloth = await ClothingItem.findByIdAndDelete(id);
    if (!deletedCloth) {
      return res
        .status(404)
        .json({ status: "failed", message: "Cloth not found" });
    }

    // Return success response
    res
      .status(200)
      .json({ status: "success", message: "Cloth deleted successfully." });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};