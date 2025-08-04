import React from 'react';

const BrandInput = ({ brand, handleBrandChange }) => (
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
);

export default BrandInput;
