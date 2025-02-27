import React, { forwardRef } from "react";

const ShaderCanvas = forwardRef<HTMLCanvasElement>((props, ref) => {
  return (
    <canvas 
        ref={ref} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'block',
          backgroundColor: '#000'
        }} 
      />
  );
});

export default ShaderCanvas;
