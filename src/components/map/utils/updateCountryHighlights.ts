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

    // Draw Santa's trail
    const sourceId = 'santa-trail';
    const layerId = 'santa-trail-layer';

    // Remove existing trail if it exists
    if (map.getSource(sourceId)) {
      map.removeLayer(layerId);
      map.removeSource(sourceId);
    }

    // Add the trail source and layer
    if (visitedLocations.length > 0) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [...visitedLocations, santaLocation]
          }
        }
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.7,
          'line-dasharray': [2, 1]
        }
      });
    }

    // Set filters for both layers
    map.setFilter('country-visited', ['in', 'iso_3166_1_alpha_3', ...visitedCountryCodes]);
    map.setFilter('country-current', ['==', 'iso_3166_1_alpha_3', currentCountryCode]);
  } catch (error) {
    console.error('Error updating country highlights:', error);
  }
}