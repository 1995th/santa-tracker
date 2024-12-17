import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapInitialization } from './map/useMapInitialization';
import { useSantaMarker } from './map/useSantaMarker';
import MapError from './map/MapError';
import SnowOverlay from './map/SnowOverlay';

interface MapProps {
  santaLocation?: [number, number];
  visitedLocations?: [number, number][];
}

const Map: React.FC<MapProps> = ({ santaLocation = [0, 90], visitedLocations = [] }) => {
  const { mapContainer, map, error } = useMapInitialization();
  useSantaMarker(map.current, santaLocation, visitedLocations);

  if (error) {
    return <MapError message={error} />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <SnowOverlay />
      
      {/* Legend */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/50 px-6 py-3 rounded-lg flex gap-6 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#ea384c] rounded-sm opacity-70" />
          <span className="text-white text-sm">Current Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#22c55e] rounded-sm opacity-70" />
          <span className="text-white text-sm">Visited Location</span>
        </div>
      </div>
    </div>
  );
};

export default Map;