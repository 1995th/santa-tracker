import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export const useSantaMarker = (map: mapboxgl.Map | null, santaLocation?: [number, number]) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !santaLocation) return;

    // Create or update Santa marker with tooltip
    if (!markerRef.current) {
      const markerElement = document.createElement('div');
      markerElement.className = 'flex flex-col items-center';
      
      // Santa emoji
      const santaEmoji = document.createElement('div');
      santaEmoji.className = 'santa-marker';
      santaEmoji.innerHTML = '🎅';
      santaEmoji.style.fontSize = '2rem';
      
      // Location tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'bg-santa-red text-white px-2 py-1 rounded-full text-xs mt-1 whitespace-nowrap';
      tooltip.innerHTML = 'North Pole';
      
      markerElement.appendChild(santaEmoji);
      markerElement.appendChild(tooltip);

      markerRef.current = new mapboxgl.Marker(markerElement)
        .setLngLat(santaLocation)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(santaLocation);
      // Update tooltip text
      const tooltipElement = markerRef.current.getElement().querySelector('.bg-santa-red');
      if (tooltipElement) {
        tooltipElement.innerHTML = 'North Pole';
      }
    }

    // Highlight area under Santa
    map.once('idle', () => {
      // For North Pole specifically
      if (santaLocation[1] >= 85) {
        // Set a custom polygon for the North Pole area
        map.setFilter('country-highlighted', [
          'all',
          ['>=', ['get', 'latitude'], 85],
          ['<=', ['get', 'longitude'], 180],
          ['>=', ['get', 'longitude'], -180]
        ]);
      } else {
        // For other locations, use country boundaries
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