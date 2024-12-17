import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapInitialization } from './map/useMapInitialization';
import { useSantaMarker } from './map/useSantaMarker';
import MapError from './map/MapError';
import SnowOverlay from './map/SnowOverlay';

interface MapProps {
  santaLocation?: [number, number];
}

const Map: React.FC<MapProps> = ({ santaLocation = [0, 90] }) => {
  const { mapContainer, map, error } = useMapInitialization();
  useSantaMarker(map.current, santaLocation);

  if (error) {
    return <MapError message={error} />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <SnowOverlay />
    </div>
  );
};

export default Map;