import React from 'react';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';

Modal.setAppElement("#root");

const CropModal = ({
  isCropping,
  imageSrc,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  cropImage,
  skipCropping,
  showRedMask,
  setShowRedMask,
  setIsCropping
}) => (
  <Modal
    isOpen={isCropping}
    onRequestClose={() => setIsCropping(false)}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
  >
    <div className="bg-white p-4 rounded-lg shadow-lg z-50 w-96">
      <h2 className="text-lg font-bold mb-4">Crop Image</h2>
      <div
        className="crop-container"
        style={{ width: "100%", height: "500px", position: "relative" }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          cropShape="rect"
          showGrid={true}
          restrictPosition={false}
        />
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setIsCropping(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={skipCropping}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Skip Cropping
        </button>
        <button
          onClick={cropImage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crop & Upload
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowRedMask((prev) => !prev)}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            {showRedMask ? "Switch to Transparent Sticker" : "Switch to Red Mask Preview"}
          </button>
        </div>
      </div>
    </div>
  </Modal>
);

export default CropModal;