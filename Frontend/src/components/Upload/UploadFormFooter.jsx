import React from 'react';

const UploadFormFooter = ({ handleClick }) => (
  <div className="max-w-md mx-auto p-4">
    <button
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-4"
      onClick={handleClick}
    >
      Save Cloth
    </button>
  </div>
);

export default UploadFormFooter;