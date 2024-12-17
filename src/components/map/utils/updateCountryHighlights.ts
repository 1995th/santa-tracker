import mapboxgl from 'mapbox-gl';
import { isValidCoordinate } from './validateCoordinates';

export function updateCountryHighlights(
  map: mapboxgl.Map,
  santaLocation: [number, number],
  visitedLocations: [number, number][]
) {
  try {
    // Wait for the source to be loaded
    if (!map.getSource('country-boundaries')) {
      console.log('Country boundaries source not loaded yet');
      return;
    }

    // Get current country
    const point = map.project(santaLocation);
    const features = map.queryRenderedFeatures(point, {
      layers: ['country-visited']
    });
    
    // Handle North Pole special case
    const isNorthPole = Math.abs(santaLocation[1] - 90) < 0.1; // Check if latitude is close to 90°N
    const currentCountryCode = isNorthPole ? 'NP' : (features[0]?.properties?.iso_3166_1_alpha_3 || '');
    
    console.log('Current location:', santaLocation);
    console.log('Is North Pole:', isNorthPole);
    console.log('Current country code:', currentCountryCode);
    console.log('Features found:', features);
    
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

    console.log('Visited country codes:', visitedCountryCodes);

    // Set filters for both layers
    map.setFilter('country-visited', ['in', 'iso_3166_1_alpha_3', ...visitedCountryCodes]);
    
    // For the current location, if it's the North Pole, highlight a circular area
    if (isNorthPole) {
      // Add a special circle layer for the North Pole if it doesn't exist
      if (!map.getLayer('north-pole-highlight')) {
        map.addSource('north-pole-point', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: santaLocation
            },
            properties: {}
          }
        });

        map.addLayer({
          id: 'north-pole-highlight',
          type: 'circle',
          source: 'north-pole-point',
          paint: {
            'circle-radius': 50,
            'circle-color': '#ea384c',
            'circle-opacity': 0.7
          }
        });
      } else {
        // Update the circle position
        (map.getSource('north-pole-point') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: santaLocation
          },
          properties: {}
        });
      }
    } else {
      // Remove North Pole highlight if we're not at the North Pole
      if (map.getLayer('north-pole-highlight')) {
        map.removeLayer('north-pole-highlight');
        map.removeSource('north-pole-point');
      }
      // Set regular country highlight
      map.setFilter('country-current', ['==', 'iso_3166_1_alpha_3', currentCountryCode]);
    }
  } catch (error) {
    console.error('Error updating country highlights:', error);
  }
}