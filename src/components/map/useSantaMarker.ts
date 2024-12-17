import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export const useSantaMarker = (map: mapboxgl.Map | null, santaLocation?: [number, number], visitedLocations: [number, number][] = []) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !santaLocation) return;

    // Create or update Santa marker
    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'santa-marker';
      
      // Create and set up the image
      const img = document.createElement('img');
      img.src = 'https://em-content.zobj.net/source/microsoft-teams/363/santa-claus_1f385.png';
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.objectFit = 'contain';
      
      el.appendChild(img);
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.zIndex = '9999';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.3s ease';
      
      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      markerRef.current = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
        rotationAlignment: 'viewport', // Makes marker always face the camera
        pitchAlignment: 'viewport',    // Keeps marker upright regardless of map pitch
      })
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