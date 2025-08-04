import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import {
  deleteItem,
  OCCASIONS,
  SEASONS,
} from "../Utils/apiFunctions";
import { infoToast, errorToast, successToast } from "../Utils/Toastify";
import MultiSelectDropdown from "../Components/MultiSelectDropdown";
import CarouselComponent from "../Components/CarouselComponent";

const API_BASE_URL = "http://localhost:3000";

const Outfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/allOutfits`);
        // Assuming the response data contains the outfits in res.data.data
        setOutfits(res.data.data || []);
      } catch (error) {
        console.error("Error fetching outfits:", error);
        errorToast("Failed to fetch outfits from server.");
      }
    };

    fetchOutfits();
  }, []);

  // For debugging: log any missing occasions or seasons
  useEffect(() => {
    outfits.forEach((outfit, index) => {
      console.log(`Outfit ${index}:`, outfit);
      if (!outfit.occasion)
        console.warn(`Outfit ${index} is missing an occasion`);
      if (!outfit.season)
        console.warn(`Outfit ${index} is missing a season`);
    });
  }, [outfits]);

  const handleDelete = (outfitId) => {
    try {
      const updatedOutfits = deleteItem("Outfits", outfitId);
      setOutfits(updatedOutfits);
      successToast("Outfit deleted successfully");
    } catch (error) {
      errorToast("Failed to delete outfit");
    }
  };

  const resetFilters = () => {
    infoToast("Filters reset");
    setSelectedOccasions([]);
    setSelectedSeasons([]);
  };

  const filteredOutfits = outfits.filter((outfit) => {
    const matchesOccasions =
      selectedOccasions.length === 0 ||
      (outfit.occasion &&
        selectedOccasions.some((oc) => outfit.occasion.includes(oc)));
    const matchesSeasons =
      selectedSeasons.length === 0 ||
      (outfit.season &&
        selectedSeasons.some((season) => outfit.season.includes(season)));

    return matchesOccasions && matchesSeasons;
  });

  return (
    <div className="min-h-screen p-4">
      <Navbar />
      <div className="mb-4 flex flex-wrap gap-2">
        <MultiSelectDropdown
          dropdownTitle="Filter by Occasions"
          itemsArray={OCCASIONS}
          selectedItems={selectedOccasions}
          onSelectionChange={setSelectedOccasions}
        />
        <MultiSelectDropdown
          dropdownTitle="Filter by Seasons"
          itemsArray={SEASONS}
          selectedItems={selectedSeasons}
          onSelectionChange={setSelectedSeasons}
        />
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>
      <div>
        <div className="flex flex-row">
          <div className="flex flex-col w-full h-full relative">
            {filteredOutfits.length > 0 ? (
              <div className="mb-8 relative">
                <h2 className="text-2xl font-bold text-center mb-4">
                  Outfits
                </h2>
                <div className="relative z-10">
                  <CarouselComponent
                    isWardrobe={false}
                    isOutfits={true}
                    data={filteredOutfits.map((outfit) => ({
                      clothId: outfit._id,
                      imageUrl: outfit.imageUrl,
                      outfitItems: outfit.outfitItems,
                    }))}
                  />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">No outfits found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outfits;
