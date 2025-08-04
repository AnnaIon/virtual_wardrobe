import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

import {
  clothingColors,
  categories,
  allMaterials,
  SEASONS,
  OCCASIONS,
} from "../../Utils/apiFunctions";

import { infoToast, errorToast, successToast } from "../../Utils/Toastify";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../Utils/cropImage";
import Modal from "react-modal";
Modal.setAppElement("#root"); // ✅ Add this before your component

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dh8by1ypp/image/upload"; // Replace with your Cloudinary URL
const UPLOAD_PRESET = "imagesStorage"; // Replace with your upload preset

const Upload = () => {
  const [clothes, setClothes] = useState([]);
  const [error, setError] = useState("");
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [category, setCategory] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownTitles, setDropdownTitles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredColors, setFilteredColors] = useState(clothingColors);
  const [isOpen, setIsOpen] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isMaterialDropdownOpen, setIsMaterialDropdownOpen] = useState(false);
  const [searchMaterial, setSearchMaterial] = useState("");

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 });

  const [isEditing, setIsEditing] = useState(false);
  const [editedImageSrc, setEditedImageSrc] = useState(null);
  const [showRedMask, setShowRedMask] = useState(true);

  const toggleMaterialDropdown = () => {
    setIsMaterialDropdownOpen((prev) => !prev);
    if (isMaterialDropdownOpen) {
      setSearchMaterial(""); // Clear search when closing dropdown
    }
  };

  const handleMaterialClick = (material) => {
    setClothes((prevClothes) =>
      prevClothes.map((cloth) =>
        cloth.id === clothes[clothes.length - 1]?.id
          ? { ...cloth, material }
          : cloth
      )
    );
    setSelectedMaterial(material);
    setIsMaterialDropdownOpen(false); // Close dropdown after selection
  };

  const handleSearchMaterialChange = (e) => {
    setSearchMaterial(e.target.value);
  };

  const filteredMaterials = allMaterials.filter((material) =>
    material.toLowerCase().includes(searchMaterial.toLowerCase())
  );

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredColors(
      clothingColors.filter((color) =>
        color.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleColorClick = (color) => {
    setClothes((prevClothes) =>
      prevClothes.map((cloth, index) =>
        index === prevClothes.length - 1
          ? {
              ...cloth,
              color,
              name: `${cloth.clothType || ""} ${color}`.trim(), // Generate name dynamically
            }
          : cloth
      )
    );
    setSelectedColor(color);
    setDropdownTitles((prev) => ({ ...prev, color: color })); // Update dropdown title for color
    setIsColorDropdownOpen(false); // Close dropdown after selection
  };

  const toggleColorDropdown = () => {
    setIsColorDropdownOpen((prev) => !prev);
    if (isColorDropdownOpen) {
      setSearchTerm(""); // Clear search when closing dropdown
    }
  };

  const handleTypeClick = (type, categoryName) => {
    setClothes((prevClothes) =>
      prevClothes.map((cloth, index) =>
        index === prevClothes.length - 1
          ? {
              ...cloth,
              clothType: type,
              category: categoryName,
              name: `${type} ${cloth.color || ""}`.trim(), // Generate name dynamically
            }
          : cloth
      )
    );
    setSelectedType(type);
    setCategory(categoryName);
    setDropdownTitles((prev) => ({ ...prev, [categoryName]: type })); // Update dropdown title for type
    setOpenDropdown(null); // Close dropdown after selection
  };

  const toggleDropdown = (categoryName) => {
    setDropdownTitles((prev) => {
      const updatedTitles = { ...prev };

      // Reset the title of the previously open dropdown to its category name
      if (openDropdown && openDropdown !== categoryName) {
        updatedTitles[openDropdown] = null;
      }

      return updatedTitles;
    });

    // Ensure categoryName is passed properly
    if (typeof categoryName === "string") {
      setOpenDropdown((prev) => (prev === categoryName ? null : categoryName));
      setCategory(categoryName);
    }
  };

  const handleSeasonClick = (season) => {
    setClothes((prevClothes) =>
      prevClothes.map((cloth) =>
        cloth.id === clothes[clothes.length - 1]?.id
          ? {
              ...cloth,
              season: cloth.season.includes(season)
                ? cloth.season.filter((s) => s !== season)
                : [...cloth.season, season],
            }
          : cloth
      )
    );
    setSelectedSeasons((prevSeasons) =>
      prevSeasons.includes(season)
        ? prevSeasons.filter((s) => s !== season)
        : [...prevSeasons, season]
    );
  };
  const handleOccasionClick = (occasion) => {
    setClothes((prevClothes) =>
      prevClothes.map((cloth) =>
        cloth.id === clothes[clothes.length - 1]?.id
          ? {
              ...cloth,
              occasion: cloth.occasion.includes(occasion)
                ? cloth.occasion.filter((o) => o !== occasion)
                : [...cloth.occasion, occasion],
            }
          : cloth
      )
    );
    setSelectedOccasions((prevOccasions) =>
      prevOccasions.includes(occasion)
        ? prevOccasions.filter((o) => o !== occasion)
        : [...prevOccasions, occasion]
    );
  };

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setBrand(newBrand);

    setClothes((prevClothes) =>
      prevClothes.map((cloth, index) =>
        index === prevClothes.length - 1
          ? { ...cloth, brand: newBrand } // Only update after image upload
          : cloth
      )
    );
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onCropSizeChange = useCallback((cropWidth, cropHeight) => {
    setCropSize({ width: cropWidth, height: cropHeight });
  }, []);

  const handleImageUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result); // ✅ Needed for <Cropper />
      setIsCropping(true); // ✅ Shows the modal
    };

    reader.onerror = () => {
      errorToast("Failed to read the file");
    };

    reader.readAsDataURL(file); // ✅ Triggers the `onload`
  };

  const handleEditedImageSave = (editedImage) => {
    setEditedImageSrc(editedImage);
    // Now, you can either pass editedImage to your cropper or set it directly for upload.
    setIsEditing(false);
  };

  const uploadCroppedImage = async (blob) => {
    if (!blob) return;

    try {
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = response.data.secure_url;

      const newCloth = {
        id: crypto.randomUUID(), // ✅ Better than Date.now()
        image: imageUrl,
        season: [],
        occasion: [],
        clothType: null,
        category: null,
        color: null,
        name: "",
        brand: "",
        material: null,
      };
      

      setClothes((prev) => [...prev, newCloth]);
      setIsCropping(false);
      setImageSrc(null);
      successToast("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      errorToast("Image upload failed.");
    }
  };

  const skipCropping = async () => {
    try {
      const formData = new FormData();
      formData.append("file", imageSrc); // Upload the original image
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = response.data.secure_url;

      setClothes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(), // ✅ Add this here too
          image: imageUrl,
          season: [],
          occasion: [],
          clothType: null,
          category: null,
          color: null,
          name: "",
          brand: "",
          material: null,
        },
      ]);
      
      setIsCropping(false);
      setCroppedImage(null);
      setImageSrc(null);
      successToast("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      errorToast("Image upload failed.");
    }
  };

  const cropImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      await uploadCroppedImage(croppedBlob); // ✅ pass it directly
    } catch (error) {
      console.error("Cropping failed:", error);
      errorToast("Cropping failed.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ["image/jpeg", "image/png"],
    onDrop: handleImageUpload,
  });

  console.log(clothes);

  const handleClick = async () => {
    if (clothes.length === 0) {
      errorToast("Please upload and fill in all details before saving.");
      return;
    }
  
    const lastCloth = clothes[clothes.length - 1];
  
    // Ensure the latest cloth gets the brand + selections
    const updatedCloth = {
      id: lastCloth.id,
      image: lastCloth.image,
      clothType: selectedType,
      category,
      color: selectedColor,
      brand,
      material: selectedMaterial,
      season: selectedSeasons,
      occasion: selectedOccasions,
      name: `${selectedType || ""} ${selectedColor || ""}`.trim(),
    };
    
    // Validation
    const isIncomplete = !updatedCloth.clothType ||
      !updatedCloth.category ||
      !updatedCloth.color ||
      !updatedCloth.material ||
      updatedCloth.season.length === 0 ||
      updatedCloth.occasion.length === 0;
  
    if (isIncomplete) {
      errorToast("Please fill in all details before saving.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4000/uploadCloth", updatedCloth);
      if (response.status === 201) {
        successToast(`"${updatedCloth.name}" saved successfully!`);
      }
  
      // Clear state
      setClothes([]);
      setSelectedType(null);
      setSelectedColor(null);
      setSelectedMaterial(null);
      setSelectedSeasons([]);
      setSelectedOccasions([]);
      setBrand("");
      setCategory(null);
    } catch (error) {
      console.error("Error saving:", error);
      errorToast("Failed to save cloth.");
    }
  };
  
  return (
    <div>
      <div
        {...getRootProps({ className: "dropzone" })}
        className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag and drop photos here, or click to select photos (.jpg, .png,
          .gif)
        </p>
      </div>
      {isCropping && (
        <Modal
          isOpen={isCropping}
          onRequestClose={() => setIsCropping(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-4 rounded-lg shadow-lg z-50 w-96">
            <h2 className="text-lg font-bold mb-4">Crop Image</h2>
            <div
              className="crop-container"
              style={{ width: "100%", height: "500px", position: "relative" }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // Set the aspect ratio (1 for square, 4/3 for rectangle, etc.)
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="rect" // Rectangular crop
                showGrid={true} // Show grid for better alignment
                restrictPosition={false}
              />{" "}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsCropping(false)} // Close without saving
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={skipCropping}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Skip Cropping
              </button>
              <button
                onClick={cropImage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Crop & Upload
              </button>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowRedMask((prev) => !prev)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  {showRedMask
                    ? "Switch to Transparent Sticker"
                    : "Switch to Red Mask Preview"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="mt-6 grid grid-cols-3 gap-4">
        {clothes.map((cloth) => (
          <div
            key={cloth.id}
            className="w-full h-24 rounded-lg overflow-hidden shadow-md"
          >
            <img src={cloth.image} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div>
        <p className=" flex flex-row text-lg font-bold mb-4">Types of</p>

        {Object.entries(categories).map(([categoryName, items]) => (
          <div key={categoryName} className="mb-4 relative">
            <button
              onClick={() => toggleDropdown(categoryName)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            >
              {dropdownTitles[categoryName] || categoryName}
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {openDropdown === categoryName && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600 z-50">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  {items.map((type, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        onClick={() => handleTypeClick(type, categoryName)}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
                      >
                        {type}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="relative w-64">
        {/* Dropdown Button */}
        <button
          onClick={toggleColorDropdown}
          className="w-full flex justify-between items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
        >
          {selectedColor || " Select Color"}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isColorDropdownOpen && (
          <div className="absolute left-0 mt-2 w-full max-h-60 bg-white rounded-lg shadow-lg overflow-y-auto z-50 divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
            {/* Search Bar */}
            <div className="sticky top-0 bg-white dark:bg-gray-700 z-10">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search colors..."
                className="w-full px-3 py-2 text-sm border-b focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {/* List of Colors */}
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {filteredColors.map((color, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleColorClick(color)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    {color}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="relative w-64 mt-4">
        {/* Dropdown Button */}
        <button
          onClick={toggleMaterialDropdown}
          className="w-full flex justify-between items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
        >
          {selectedMaterial || "Select Material"}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isMaterialDropdownOpen && (
          <div className="absolute left-0 mt-2 w-full max-h-60 bg-white rounded-lg shadow-lg overflow-y-auto z-50 divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
            {/* Search Input */}
            <div className="p-2">
              <input
                type="text"
                placeholder="Search Material..."
                value={searchMaterial}
                onChange={handleSearchMaterialChange}
                className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-500"
              />
            </div>

            {/* Material List */}
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleMaterialClick(material)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {material}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                  No materials found.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Occasion Buttons */}
      <div>
        <p className="text-lg font-bold mb-4">Type of Occasion:</p>
        {OCCASIONS.map((occasion, index) => (
          <button
            key={index}
            onClick={() => handleOccasionClick(occasion)}
            className={`text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 
              ${
                selectedOccasions.includes(occasion)
                  ? "bg-blue-800 text-white"
                  : "hover:bg-blue-800 hover:text-white"
              }`}
          >
            {occasion}
          </button>
        ))}
      </div>

      {/* Season Selection */}
      <div>
        <p className="text-lg font-bold mb-4">Type of Season:</p>
        {SEASONS.map((season, index) => (
          <button
            key={index}
            onClick={() => handleSeasonClick(season)}
            className={`text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 
              ${
                selectedSeasons.includes(season)
                  ? "bg-blue-800 text-white"
                  : "hover:bg-blue-800 hover:text-white"
              }`}
          >
            {season}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Brand Name:
        </label>
        <input
          type="text"
          value={brand}
          onChange={handleBrandChange}
          placeholder="Enter brand name"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Dropzone for Image Upload */}
      <div className="max-w-md mx-auto p-4">
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-4"
          onClick={handleClick}
        >
          Save Cloth
        </button>
      </div>
    </div>
  );
};

export default Upload;
