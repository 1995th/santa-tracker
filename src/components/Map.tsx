import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapInitialization } from './map/useMapInitialization';
import { useSantaMarker } from './map/useSantaMarker';
import MapError from './map/MapError';

interface MapProps {
  santaLocation?: [number, number];
}

const Map: React.FC<MapProps> = ({ santaLocation }) => {
  const { mapContainer, map, error } = useMapInitialization();
  useSantaMarker(map.current, santaLocation);

  if (error) {
    return <MapError message={error} />;
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;