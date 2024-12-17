import mapboxgl from 'mapbox-gl';
import { isValidCoordinate } from './validateCoordinates';

export function updateCountryHighlights(
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