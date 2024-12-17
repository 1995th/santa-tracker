import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { isValidCoordinate } from './utils/validateCoordinates';
import { createMarkerElement } from './utils/createMarkerElement';
import { updateCountryHighlights } from './utils/updateCountryHighlights';

export const useSantaMarker = (
  map: mapboxgl.Map | null,
  santaLocation?: [number, number],
  visitedLocations: [number, number][] = []
) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !santaLocation) return;

    // Validate coordinates
    const [lng, lat] = santaLocation;
    if (!isValidCoordinate(lng, lat)) {
      console.error('Invalid coordinates:', santaLocation);
      return;
    }

    // Create or update Santa marker
    if (!markerRef.current) {
      const el = createMarkerElement();
      
      markerRef.current = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
        rotationAlignment: 'viewport',
        pitchAlignment: 'viewport',
      })
        .setLngLat(santaLocation)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(santaLocation);
    }

    // Update country highlights when map is ready
    map.once('idle', () => {
      updateCountryHighlights(map, santaLocation, visitedLocations);
    });

    // Fly to valid coordinates
    if (isValidCoordinate(santaLocation[0], santaLocation[1])) {
      map.flyTo({
        center: santaLocation,
        zoom: 3,
        duration: 2000,
      });
    }
  }, [map, santaLocation, visitedLocations]);

  return markerRef;
};