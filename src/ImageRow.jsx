import React from 'react';
import './ImageRow.css';

const ImageRow = ({ images }) => {
  return (
    <div className="image-row">
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Image ${index + 1}`} className="image-item" />
      ))}
    </div>
  );
};

export default ImageRow;
