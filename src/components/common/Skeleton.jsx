import React from 'react';
import './Skeleton.css';

const Skeleton = ({ className = '', style = {}, variant = 'text', width, height }) => {
  const inlineStyle = {
    ...style,
    width: width || style.width,
    height: height || style.height
  };

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`} 
      style={inlineStyle}
    />
  );
};

export default Skeleton;
