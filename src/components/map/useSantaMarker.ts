import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// Helper function to validate coordinates
function isValidCoordinate(lng: number, lat: number): boolean {
  return (
    typeof lng === 'number' &&
    typeof lat === 'number' &&
    !isNaN(lng) &&
    !isNaN(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

// Create marker element with Santa image
function createMarkerElement(): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'santa-marker';
  
  const img = document.createElement('img');
  img.src = 'https://static.tiktokemoji.com/202411/09/wch3Esw3.webp';
  img.style.width = '60px';
  img.style.height = '60px';
  img.style.objectFit = 'contain';
  
  el.appendChild(img);
  el.style.width = '60px';
  el.style.height = '60px';
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

  return el;
}

// Update country highlights on the map
function updateCountryHighlights(
  map: mapboxgl.Map,
  santaLocation: [number, number],
  visitedLocations: [number, number][]
) {
  try {
    // Get current country
    const point = map.project(santaLocation);
    const features = map.queryRenderedFeatures(point, {
      layers: ['country-visited']
    });
    
    const currentCountryCode = features[0]?.properties?.iso_3166_1_alpha_3 || '';
    
    // Update visited countries filter
    const visitedCountryCodes = visitedLocations
      .filter(loc => isValidCoordinate(loc[0], loc[1]))
      .map(loc => {
        const features = map.queryRenderedFeatures(map.project(loc), {
          layers: ['country-visited']
        });
        return features[0]?.properties?.iso_3166_1_alpha_3 || '';
      })
      .filter(Boolean);

    // Set filters for both layers
    map.setFilter('country-visited', ['in', 'iso_3166_1_alpha_3', ...visitedCountryCodes]);
    map.setFilter('country-current', ['==', 'iso_3166_1_alpha_3', currentCountryCode]);
  } catch (error) {
    console.error('Error updating country highlights:', error);
  }
}

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