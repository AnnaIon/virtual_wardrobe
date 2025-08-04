// /src/utils/weather.js
export const fetchWeather = async (location) => {
    const apiKey = '03426ffe48b48ec875b00f3f1711a03b';
    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
    return weatherData.json();
  };
  
  export const filterOutfitsByWeather = (weatherData, clothes, timeOfDay, selectedOccasions, selectedColors) => {
    const currentTemp = weatherData.main.temp - 273.15; // Convert Kelvin to Celsius
    console.log('Current temperature in Celsius:', currentTemp);
  
    // Advanced season logic based on temperature
    let suitableSeason = '';
  
    if (currentTemp < 0) {
      suitableSeason = "Winter";
    } else if (currentTemp >= 0 && currentTemp < 10) {
      suitableSeason = "Spring";
    } else if (currentTemp >= 10 && currentTemp < 20) {
      suitableSeason = "Autumn";
    } else if (currentTemp >= 20) {
      suitableSeason = "Summer";
    }
  
    // Consider time of day: If it's evening (e.g., after 6 PM), it could be cooler
    if (timeOfDay === 'evening' && suitableSeason !== 'Winter') {
      suitableSeason = 'Autumn'; // Suggest autumn wear even if it's summer or spring
    }
  
    // Filter clothes based on the suitable season
    let filteredClothes = clothes.filter(cloth => cloth.season.includes(suitableSeason));
  
    // Filter by selected occasions (allow multiple selections)
    if (selectedOccasions.length > 0) {
      filteredClothes = filteredClothes.filter(cloth =>
        selectedOccasions.some(occasion => cloth.occasion.includes(occasion))
      );
    }
  
    // Filter by selected colors (allow multiple selections)
    if (selectedColors.length > 0) {
      filteredClothes = filteredClothes.filter(cloth =>
        selectedColors.some(color => cloth.color.toLowerCase() === color.toLowerCase())
      );
    }
  
    return filteredClothes;
  };
  