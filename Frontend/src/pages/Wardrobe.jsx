import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Upload from "../components/Upload/Upload";
import Statistics from "../components/Statistics";
import { getDataFromMongoDB } from "../Utils/apiFunctions"; 

const categoryList = [
  "Tops",
  "Bottoms",
  "Outerwears",
  "Dresses",
  "Undergarments",
  "Footwear",
  "Accessories",
  "Jewelry",
];

const Wardrobe = () => {
  const [wardrobeData, setWardrobeData] = useState([]);
  const [groupedDataByCategory, setGroupedDataByCategory] = useState({});
  const [isWardrobe, setIsWardrobe] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  // Use the getDataFromMongoDB function to fetch the data
  useEffect(() => {
    const fetchWardrobeItems = async () => {
      const items = await getDataFromMongoDB();
      console.log("Fetched items:", items);
      setWardrobeData(items);

      // Group the data by category
      const grouped = categoryList.reduce((acc, category) => {
        acc[category] = items.filter((item) => item.category === category);
        return acc;
      }, {});
      setGroupedDataByCategory(grouped);
    };

    fetchWardrobeItems();
  }, []);

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };
  const toggleStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-row justify-between">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={toggleUpload}
        >
          Add
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
          onClick={toggleStatistics}
        >
          Statistics
        </button>
      </div>

      <div
        className={`transition-all duration-300 ${
          showUpload || showStatistics ? "blur-lg" : ""
        }`}
      >
        <div className="flex flex-row">
          <div className="flex flex-col w-full h-full relative">
            {categoryList.map((category) =>
              groupedDataByCategory[category]?.length > 0 ? (
                <div key={category} className="mb-8 relative">
                  <h2 className="text-2xl font-bold text-center mb-4">
                    {category}
                  </h2>
                  <div className="relative z-10">
                    <CarouselComponent
                      isWardrobe={isWardrobe}
                      data={groupedDataByCategory[category]}
                    />
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-1/2 h-1/2">
            <button
              onClick={toggleUpload}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <div className="overflow-y-auto h-full">
              <Upload />
            </div>
          </div>
        </div>
      )}

      {showStatistics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-1/2 h-1/2">
            <button
              onClick={toggleStatistics}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <div className="overflow-y-auto h-full">
              <Statistics />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wardrobe;
