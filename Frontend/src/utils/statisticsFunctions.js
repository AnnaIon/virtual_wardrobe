
  // 🛍️ 1. Get Total Items in Wardrobe
  export const getTotalWardrobeItems = async () => {
    try {
      const response = await fetch("http://localhost:3000/allClothes");
      const data = await response.json();
      return data.data.length; // Access the array inside the response
    } catch (error) {
      console.error("Error fetching wardrobe items:", error);
      return 0;
    }
  };
    
  // 🏷️ 2. Get Item Categories Breakdown
  export const getCategoryBreakdown = async () => {
    try {
      const response = await fetch("http://localhost:3000/allClothes");
      const data = await response.json();
      const wardrobeItems = data.data;
  
      const categoryCount = {};
      wardrobeItems.forEach((item) => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      });
  
      return categoryCount;
    } catch (error) {
      console.error("Error fetching category breakdown:", error);
      return {};
    }
  };
    
  // 🔥 3. Get Most Worn Items (Top 5)
  export const getMostWornItems = async () => {
    try {
      const response = await fetch("http://localhost:3000/allOutfits");
      const outfitData = await response.json();
      const outfits = outfitData.data;
  
      const responseClothes = await fetch("http://localhost:3000/allClothes");
      const clothesData = await responseClothes.json();
      const wardrobeItems = clothesData.data;
  
      const usageCount = {};
  
      outfits.forEach((outfit) => {
        outfit.items.forEach((item) => {
          usageCount[item._id] = (usageCount[item._id] || 0) + 1;
        });
      });
  
      const sortedItems = Object.entries(usageCount)
        .sort((a, b) => b[1] - a[1]) // Sort by usage count (descending)
        .slice(0, 5); // Take top 5
  
      return sortedItems.map(([id, count]) => {
        const item = wardrobeItems.find((item) => item._id === id);
        return {
          id,
          count,
          image: item?.image,
          name: item?.name,
        };
      });
    } catch (error) {
      console.error("Error fetching most worn items:", error);
      return [];
    }
  };
    
  
  // ❌ 4. Get Never Worn Items
  export const getNeverWornItems = async () => {
    try {
      const responseClothes = await fetch("http://localhost:3000/allClothes");
      const clothesData = await responseClothes.json();
      const wardrobeItems = clothesData.data;
  
      const responseOutfits = await fetch("http://localhost:3000/allOutfits");
      const outfitsData = await responseOutfits.json();
      const outfits = outfitsData.data;
  
      const wornItems = new Set();
      outfits.forEach((outfit) => {
        outfit.items.forEach((item) => wornItems.add(item._id));
      });
  
      return wardrobeItems.filter((item) => !wornItems.has(item._id));
    } catch (error) {
      console.error("Error fetching never worn items:", error);
      return [];
    }
  };
    
  // 🧥 1. Get Total Outfits Created
  export const getTotalOutfitsCreated = async () => {
    try {
      const response = await fetch("http://localhost:3000/allOutfits");
      const data = await response.json();
      return data.data.length;
    } catch (error) {
      console.error("Error fetching total outfits:", error);
      return 0;
    }
  };
  
  // 🎨 2. Get Favorite Colors in Outfits
  export const getFavoriteColorsInOutfits = async () => {
    try {
      const response = await fetch("http://localhost:3000/allClothes");
      const data = await response.json();
      const wardrobeItems = data.data;
  
      const colorCount = {};
  
      wardrobeItems.forEach((item) => {
        const colors = item.color.split(",");
        colors.forEach((color) => {
          color = color.trim().toLowerCase();
          colorCount[color] = (colorCount[color] || 0) + 1;
        });
      });
  
      const sortedColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
  
      return sortedColors.map(([color, count]) => ({
        color,
        percentage: ((count / wardrobeItems.length) * 100).toFixed(2),
      }));
    } catch (error) {
      console.error("Error fetching favorite colors:", error);
      return [];
    }
  };

  export const getSeasonalPreferences = async () => {
    try {
      const response = await fetch("http://localhost:3000/allOutfits");
      const data = await response.json();
      const outfits = data.data;
  
      if (!outfits || outfits.length === 0) return [];
  
      const seasonCount = {};
  
      outfits.forEach((outfit) => {
        if (Array.isArray(outfit.season)) {
          outfit.season.forEach((season) => {
            seasonCount[season] = (seasonCount[season] || 0) + 1;
          });
        }
      });
  
      const totalOutfits = outfits.length;
      return Object.entries(seasonCount).map(([season, count]) => ({
        season,
        percentage: ((count / totalOutfits) * 100).toFixed(2),
      }));
    } catch (error) {
      console.error("Error fetching seasonal preferences:", error);
      return [];
    }
  };
    
  export const getOccasionBreakdown = async () => {
    try {
      const response = await fetch("http://localhost:3000/allOutfits");
      const data = await response.json();
      const outfits = data.data;
  
      if (!outfits || outfits.length === 0) return [];
  
      const occasionCount = {};
  
      outfits.forEach((outfit) => {
        if (Array.isArray(outfit.occasion)) {
          outfit.occasion.forEach((occasion) => {
            occasionCount[occasion] = (occasionCount[occasion] || 0) + 1;
          });
        }
      });
  
      const totalOutfits = outfits.length;
      return Object.entries(occasionCount).map(([occasion, count]) => ({
        occasion,
        percentage: ((count / totalOutfits) * 100).toFixed(2),
      }));
    } catch (error) {
      console.error("Error fetching occasion breakdown:", error);
      return [];
    }
  };
  