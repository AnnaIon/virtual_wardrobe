import React from 'react';
import { useDropzone } from 'react-dropzone';

const DropzoneUploader = ({ getRootProps, getInputProps }) => (
  <div
    {...getRootProps({ className: 'dropzone' })}
    className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition"
  >
    <input {...getInputProps()} />
    <p className="text-gray-600">
      Drag and drop photos here, or click to select photos (.jpg, .png,
      .gif)
    </p>
  </div>
);

export default DropzoneUploader;
