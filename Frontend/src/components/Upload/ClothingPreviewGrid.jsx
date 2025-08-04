import React from 'react';

const ClothingPreviewGrid = ({ clothes }) => (
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
);

export default ClothingPreviewGrid;