// /src/utils/outfitGenerator.js
import { fetchWeather, filterOutfitsByWeather } from './weather';


export const generateOutfitRecommendation = async (location, clothes) => {
  // Step 1: Fetch weather data for location
  const weatherData = await fetchWeather(location);
  
  // Step 2: Filter clothes by weather (season)
  const filteredByWeather = filterOutfitsByWeather(weatherData, clothes);
  
  
  // Combine both conditions
  const recommendedOutfits = createOutfits(filteredByColor);
  
  return recommendedOutfits;
};

// Function to create an outfit (you can expand this as needed)
const createOutfits = (filteredClothes) => {
  return filteredClothes.map(cloth => {
    return {
      name: cloth.name,
      image: cloth.image
    };
  });
};
