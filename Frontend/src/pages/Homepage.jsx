/* eslint-disable react/no-unknown-property */
import Navbar from "../Components/Navbar";
import {  useState, useEffect } from "react";
import DragAndDrop from "../Components/DragAndDrop";

const categories = {
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
  Outerwear: ["Jackets", "Coats", "Blazers", "Cardigans", "Vests"],
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

const Homepage = () => {
  const [dropdownTitleType, setDropdownTitleType] = useState(""); // Example state for filtering
  const [result, setResult] = useState([]);

  const categoryNames = Object.keys(categories);
  console.log(categoryNames);
 
  return (
    <div>
      <Navbar />
      <DragAndDrop itemsArray={categoryNames}  />
    </div>
  );
};

export default Homepage;
