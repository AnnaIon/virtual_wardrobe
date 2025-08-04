import React, { useEffect, useState } from "react";
import {
  getTotalWardrobeItems,
  getCategoryBreakdown,
  getMostWornItems,
  getNeverWornItems,
  getTotalOutfitsCreated,
  getFavoriteColorsInOutfits,
  getSeasonalPreferences,
  getOccasionBreakdown
} from "../Utils/statisticsFunctions";

const Statistics = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [mostWornItems, setMostWornItems] = useState([]);
  const [neverWornItems, setNeverWornItems] = useState([]);
  const [totalOutfits, setTotalOutfits] = useState(0);
  const [favoriteColors, setFavoriteColors] = useState([]);
  const [seasonalPreferences, setSeasonalPreferences] = useState([]);
  const [occasionBreakdown, setOccasionBreakdown] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setTotalItems(await getTotalWardrobeItems());
        setCategoryBreakdown(await getCategoryBreakdown());
        setMostWornItems(await getMostWornItems());
        setNeverWornItems(await getNeverWornItems());
        setTotalOutfits(await getTotalOutfitsCreated());
        setFavoriteColors(await getFavoriteColorsInOutfits());
        setSeasonalPreferences(await getSeasonalPreferences());
        setOccasionBreakdown(await getOccasionBreakdown());
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">📊 Wardrobe Statistics</h2>

      {/* Total Items */}
      <p className="mb-2">👕 <strong>Total Items:</strong> {totalItems}</p>

      {/* Total Outfits Created */}
      <p className="mb-2">🧥 <strong>Total Outfits Created:</strong> {totalOutfits}</p>

      {/* Category Breakdown */}
      <p className="mb-2">🏷️ <strong>Category Breakdown:</strong></p>
      <ul className="ml-4">
        {Object.entries(categoryBreakdown).map(([category, count]) => (
          <li key={category}>🔹 {category}: {count}</li>
        ))}
      </ul>

      {/* Favorite Colors */}
      <p className="mt-4 mb-2">🎨 <strong>Favorite Colors:</strong></p>
      {favoriteColors.length > 0 ? (
        <ul className="ml-4">
          {favoriteColors.map((color, index) => ( // Add index as fallback key
            <li key={color.color || index}>
              <span style={{ color: color.color }}>{color.color}</span>: {color.percentage}%
            </li>
          ))}
        </ul>
      ) : (
        <p>No color data available.</p>
      )}

      {/* Seasonal Preferences */}
      <p className="mt-4 mb-2">🌦️ <strong>Seasonal Preferences:</strong></p>
      {seasonalPreferences.length > 0 ? (
        <ul className="ml-4">
          {seasonalPreferences.map((season, index) => ( // Ensure key
            <li key={season.season || index}>
              {season.season}: {season.percentage}%
            </li>
          ))}
        </ul>
      ) : (
        <p>No seasonal data available.</p>
      )}

      {/* Occasion Breakdown */}
      <p className="mt-4 mb-2">🎉 <strong>Occasion Breakdown:</strong></p>
      {occasionBreakdown.length > 0 ? (
        <ul className="ml-4">
          {occasionBreakdown.map((occasion, index) => ( // Ensure key
            <li key={occasion.occasion || index}>
              {occasion.occasion}: {occasion.percentage}%
            </li>
          ))}
        </ul>
      ) : (
        <p>No occasion data available.</p>
      )}

      {/* Most Worn Items */}
      <p className="mt-4 mb-2">🔥 <strong>Most Worn Items:</strong></p>
      {mostWornItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {mostWornItems.map((item) => (
            <div key={item.id || item.name} className="flex flex-col items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg shadow"
              />
              <p className="text-sm mt-1">Worn {item.count} times</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No items worn yet.</p>
      )}

      {/* Never Worn Items */}
      <p className="mt-4 mb-2">❌ <strong>Never Worn Items:</strong></p>
      {neverWornItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {neverWornItems.map((item) => (
            <div key={item.id || item.name} className="flex flex-col items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg shadow"
              />
              <p className="text-sm mt-1">{item.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>All items have been used in outfits.</p>
      )}
    </div>
  );
};

export default Statistics;
