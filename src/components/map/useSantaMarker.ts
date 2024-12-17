import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface SantaLocation {
  location: [number, number];
  visitedCountries: string[];
}

export const useSantaMarker = (map: mapboxgl.Map | null, santaLocation?: [number, number], visitedLocations: [number, number][] = []) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !santaLocation) return;

    // Create or update Santa marker
    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'santa-marker';
      el.innerHTML = '🎅';
      el.style.fontSize = '2rem';

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat(santaLocation)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(santaLocation);
    }

    // Highlight current and visited countries
    map.once('idle', () => {
      // Get current country
      const point = map.project(santaLocation);
      const features = map.queryRenderedFeatures(point, {
        layers: ['country-visited']
      });
      
      const currentCountryCode = features[0]?.properties?.iso_3166_1_alpha_3 || '';
      
      // Update visited countries filter
      const visitedCountryCodes = visitedLocations.map(loc => {
        const features = map.queryRenderedFeatures(map.project(loc), {
          layers: ['country-visited']
        });
        return features[0]?.properties?.iso_3166_1_alpha_3 || '';
      }).filter(Boolean);

      // Set filters for both layers
      map.setFilter('country-visited', ['in', 'iso_3166_1_alpha_3', ...visitedCountryCodes]);
      map.setFilter('country-current', ['==', 'iso_3166_1_alpha_3', currentCountryCode]);
    });

    map.flyTo({
      center: santaLocation,
      zoom: 3,
      duration: 2000,
    });
  }, [map, santaLocation, visitedLocations]);

  return markerRef;
};