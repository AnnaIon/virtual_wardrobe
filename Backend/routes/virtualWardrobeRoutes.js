const express = require("express");
const virtualWardrobeController = require("../controllers/virtualWardrobeController");
const router = express.Router();


router.post("/uploadCloth", virtualWardrobeController.uploadItem);
router.get("/allClothes", virtualWardrobeController.getAllClothes);
router.get("/cloth/:id", virtualWardrobeController.getClothById);
router.patch("/updateTag/:id", virtualWardrobeController.updateTag);
router.delete("/deleteTag/:id", virtualWardrobeController.deleteTag);
router.delete("/deleteCloth/:id", virtualWardrobeController.deleteCloth);



router.post("/createOutfit", virtualWardrobeController.createOutfit);
router.get("/allOutfits", virtualWardrobeController.getAllOutfits);
router.get("/outfit/:id", virtualWardrobeController.getOutfitById);
router.delete("/deleteOutfit/:id", virtualWardrobeController.deleteOutfit);



module.exports = router;
