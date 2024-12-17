import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export const useSantaMarker = (map: mapboxgl.Map | null, santaLocation?: [number, number]) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !santaLocation) return;

    // Create or update Santa marker
    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'santa-marker';
      el.innerHTML = '🎅';
      el.style.fontSize = '3rem'; // Make Santa emoji larger
      el.style.cursor = 'default';
      el.style.filter = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'; // Add shadow for better visibility

      markerRef.current = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat(santaLocation)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(santaLocation);
    }

    // Highlight country under Santa
    map.once('idle', () => {
      const point = map.project(santaLocation);
      const features = map.queryRenderedFeatures(point, {
        layers: ['country-fills']
      });
      
      if (features.length > 0 && features[0].properties) {
        const countryCode = features[0].properties.iso_3166_1_alpha_3;
        map.setFilter('country-highlighted', ['==', 'iso_3166_1_alpha_3', countryCode]);
      } else {
        map.setFilter('country-highlighted', ['==', 'iso_3166_1_alpha_3', '']);
      }
    });

    map.flyTo({
      center: santaLocation,
      zoom: 3,
      duration: 2000,
    });
  }, [map, santaLocation]);

  return markerRef;
};