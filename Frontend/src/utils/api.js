const URL= "http://localhost:4000";

// Fetch data from MONGODB
export const getDataFromMongoDB = async () => {
    try {
      const response = await fetch("${URL}allClothes"); // Adjust URL as needed
      if (!response.ok) {
        throw new Error("Failed to fetch clothes from backend");
      }
      const result = await response.json();
      return result.data || []; // Assuming the backend returns { data: [...] }
    } catch (error) {
      console.error("Error retrieving clothes from MongoDB:", error);
      return [];
    }
  };
  
  // Update data in MONGO
  export const updateDataInMongoDB = async (key, updatedItems) => {
    try {
      const response = await fetch(`${URL}${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItems),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update data in MongoDB");
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating data in MongoDB:", error);
    }
  };
  
  
  
  
  //  Update specific fields 
  export const updateFieldForItem = async (itemId, field, updater) => {
    try {
      let updatedValue;
  
      // If updater is a function, fetch the current item to compute the updated value.
      if (typeof updater === "function") {
        const getResponse = await fetch(`${URL}allClothes/${itemId}`);
        if (!getResponse.ok) {
          throw new Error(`Failed to fetch item with id ${itemId}`);
        }
        const currentItem = await getResponse.json();
        updatedValue = updater(currentItem[field]);
      } else {
        updatedValue = updater;
      }
  
      // Send the updated value to the backend via the updatetag route.
      const response = await fetch(`${URL}updateTag/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, updatedValue }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update tag");
      }
  
      // Optionally, get and return the updated item.
      const updatedItem = await response.json();
      return updatedItem;
    } catch (error) {
      console.error("Error updating field for item:", error);
      return null;
    }
  };
  
  //  Delete item from MONGODB
  export const deleteItem = async (itemId) => {
    try {
      const response = await fetch(`${URL}deleteCloth/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      const result = await response.json();
      errorToast("Item deleted");
      return result; // Return the result from the backend, e.g., the updated list or a confirmation message
    } catch (error) {
      console.error("Error deleting item:", error);
      return null;
    }
  };
  
  // DELETE TAG OCCASION/SEASON
  export const deleteTagFromDB = async (itemId, field, valueToRemove) => {
    // Restrict deletion to specific fields only
    if (field !== "occasion" && field !== "season") return;
  
    try {
      const response = await fetch(`${URL}deleteTag/${itemId}`, {
        method: "PUT", // Alternatively, use DELETE if your backend supports a body with DELETE
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, valueToRemove }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }
  
      const result = await response.json();
      console.log("Updated item:", result);
      successToast(`Successfully removed ${valueToRemove} from ${field}`);
      return result;
    } catch (error) {
      console.error("Error deleting tag from DB:", error);
      return null;
    }
  };
  
  
  
  
  // Group data by categories
  export const groupedData = (data, categoryList) => {
    return categoryList.reduce((acc, category) => {
      acc[category] = data.filter((item) => item.category === category);
      return acc;
    }, {});
  };
  
  //  Find matching category for a cloth type
  export const findCategoryForType = (type, categories) => {
    for (const [category, items] of Object.entries(categories)) {
      if (items.map((i) => i.toLowerCase()).includes(type.toLowerCase())) {
        return items; // Return matched items
      }
    }
    return []; // Return empty array if no match found
  };
  
  
  export const getCategoryValues = (categories) => {
    return Object.values(categories).flat();
  };
  
  // 7. Categories for clothing types
  export const categories = {
    Tops: [
      "T-Shirts",
      "Shirts",
      "Blouses",
      "Tank Tops",
      "Sweaters",
      "Hoodies",
      "Crop Tops",
    ],
    Bottoms: ["Jeans", "Trousers", "Leggings", "Shorts", "Skirts", "Joggers"],
    Outerwears: ["Jackets", "Coats", "Blazers", "Cardigans", "Vests"],
    Dresses: ["Mini", "Midi", "Maxi", "Bodycon", "Wrap", "A-line"],
    Undergarments: ["Bras", "Underwear", "Slips"],
    Footwear: ["Sneakers", "Boots", "Sandals", "Loafers", "Heels", "Flats"],
    "Specialty Clothing": [
      "Sleepwear",
      "Swimwear",
      "Formal Wear",
      "Traditional Clothing",
    ],
    Accessories: ["Scarves", "Hats", "Gloves", "Belts", "Sunglasses"],
    Jewelry: [
      "Necklaces",
      "Earrings",
      "Bracelets",
      "Rings",
      "Watches",
      "Chokers",
      "Hair Accessories",
    ],
  };
  
  export const clothingColors = [
    "Black",
    "White",
    "Gray",
    "Navy Blue",
    "Royal Blue",
    "Sky Blue",
    "Red",
    "Maroon",
    "Pink",
    "Hot Pink",
    "Orange",
    "Peach",
    "Yellow",
    "Mustard",
    "Beige",
    "Brown",
    "Tan",
    "Green",
    "Olive Green",
    "Mint Green",
    "Lime Green",
    "Teal",
    "Turquoise",
    "Purple",
    "Lavender",
    "Lilac",
    "Burgundy",
    "Cream",
    "Ivory",
    "Gold",
    "Silver",
    "Denim",
    "Khaki",
    "Coral",
    "Rust",
    "Charcoal",
    "Cyan",
    "Magenta",
    "Plum",
    "Blue",
    "Light Blue",
    "Dark Blue",
    "Denim Blue",
    "Navy",
    "Acid Wash",
    "Stone Wash",
    "Indigo"
  ];
  
  export const colorNameToHex = {
    black: "#000000",
    white: "#FFFFFF",
    gray: "#808080",
    navyBlue: "#000080",
    royalBlue: "#4169E1",
    skyBlue: "#87CEEB",
    red: "#FF0000",
    maroon: "#800000",
    pink: "#FFC0CB",
    hotPink: "#FF69B4",
    orange: "#FFA500",
    peach: "#FFDAB9",
    yellow: "#FFFF00",
    mustard: "#FFDB58",
    beige: "#F5F5DC",
    brown: "#A52A2A",
    tan: "#D2B48C",
    green: "#008000",
    oliveGreen: "#808000",
    mintGreen: "#98FF98",
    limeGreen: "#32CD32",
    teal: "#008080",
    turquoise: "#40E0D0",
    purple: "#800080",
    lavender: "#E6E6FA",
    lilac: "#C8A2C8",
    burgundy: "#800020",
    cream: "#FFFDD0",
    ivory: "#FFFFF0",
    gold: "#FFD700",
    silver: "#C0C0C0",
    denim: "#1560BD",
    khaki: "#F0E68C",
    coral: "#FF7F50",
    rust: "#B7410E",
    charcoal: "#36454F",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    plum: "#DDA0DD",
    blue: "#0000FF",
    lightBlue: "#ADD8E6",
    darkBlue: "#00008B",
    denimBlue: "#1E3A8A",
    navy: "#000080",
    acidWash: "#B0C4DE",
    stoneWash: "#778899",
    indigo: "#4B0082"
  };
  
  export const OCCASIONS = [
    "Casual",
    "Formal",
    "Party",
    "Workwear",
    "Lounge",
    "Sport",
    "Holidays",
  ];
  export const SEASONS = ["Summer", "Winter", "Spring", "Autumn"];
  
  export const allMaterials = [
    "Cotton",
    "Linen",
    "Wool",
    "Silk",
    "Denim",
    "Polyester",
    "Nylon",
    "Rayon",
    "Spandex",
    "Velvet",
    "Chiffon",
    "Satin",
    "Cashmere",
    "Acrylic",
    "Fleece",
    "Corduroy",
    "Jersey",
    "Tweed",
    "Viscose",
    "Hemp",
    "Bamboo",
    "Modal",
    "Lyocell",
    "Lace",
    "Organza",
    "Tulle",
    "Chambray",
    "Leather",
    "Suede",
    "Canvas",
    "Rubber",
    "Synthetic",
    "Patent Leather",
    "Mesh",
    "Cork",
    "Foam",
    "PVC",
    "Neoprene",
    "Rattan",
    "Straw",
    "Faux Leather",
    "Metal",
    "Plastic",
    "Wood",
    "Silicone",
    "Resin",
    "Beads",
    "Gold",
    "Silver",
    "Platinum",
    "Stainless Steel",
    "Titanium",
    "Rose Gold",
    "Pearls",
    "Diamonds",
    "Gemstones",
    "Glass",
    "Ceramic"
  ];
  
  
  
  
  