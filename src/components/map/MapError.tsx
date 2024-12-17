import React from 'react';

interface MapErrorProps {
  message: string;
}

const MapError: React.FC<MapErrorProps> = ({ message }) => (
  <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-santa-dark text-white p-4 text-center">
    <div>
      <h2 className="text-xl font-bold mb-2">Map Error</h2>
      <p>{message}</p>
    </div>
  </div>
);

export default MapError;