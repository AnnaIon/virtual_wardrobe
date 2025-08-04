const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Outfit name
  createdAt: { type: Date, default: Date.now }, // Timestamp
  outfitItems: {
    fullBody: {
      onePiece: { 
        type: [{ type: String, enum: ["Mini Dress", "Midi Dress", "Maxi Dress", "Bodycon Dress", "Wrap Dress", "A-line Dress", "Jumpsuit", "Romper", "Overall", "Kaftan"] }],
        required: function() { return !this.outfitItems?.fullBody?.twoPiece?.top || !this.outfitItems?.fullBody?.twoPiece?.bottom; }
      },
      twoPiece: {
        tops: { 
          type: [{ type: String, enum: ["T-Shirts", "Shirts", "Blouses", "Tank Tops", "Sweaters", "Hoodies", "Crop Tops"] }],
          required: function() { return !this.outfitItems?.fullBody?.onePiece?.length; }
        },
        bottoms: { 
          type: [{ type: String, enum: ["Jeans", "Trousers", "Leggings", "Shorts", "Skirts", "Joggers"] }],
          required: function() { return !this.outfitItems?.fullBody?.onePiece?.length; }
        }
      }
    },
    footwear: { 
      type: [{ type: String, enum: ["Sneakers", "Boots", "Sandals", "Loafers", "Heels", "Flats"] }],
      required: true
    },
    outerwear: [{ type: String, enum: ["Jackets", "Coats", "Blazers", "Cardigans", "Vests"] }],
    undergarments: [{ type: String, enum: ["Bras", "Underwear", "Slips"] }],
    accessories: [{ type: String, enum: ["Scarves", "Hats", "Gloves", "Belts", "Sunglasses"] }],
    jewelry: [{ type: String, enum: ["Necklaces", "Earrings", "Bracelets", "Rings", "Watches", "Chokers", "Hair Accessories"] }]
  },
  occasion: { type: String, enum: ["Casual", "Formal", "Sport", "Party", "Business", "Lounge", "Beach"] },
  season: { type: String, enum: ["Spring", "Summer", "Autumn", "Winter", "All"] },
  imageUrl: { type: String } // Outfit preview image
});

module.exports = mongoose.model("Outfit", outfitSchema);

