import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export const useMapInitialization = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setError('WebGL is not supported in your browser. Please try using a different browser or device.');
      return;
    }

    try {
      mapboxgl.accessToken = 'pk.eyJ1IjoidG9tYXMxOTk1IiwiYSI6ImNtNHNtb21hbzAybHAycW85M2I1dHZhdXIifQ.SajP8guJWpZakxMt_zviFg';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 3,
        center: [-90, 90],
        pitch: 45,
        failIfMajorPerformanceCaveat: false,
      });

      map.current.on('load', () => {
        if (!map.current) return;
        setIsLoaded(true);

        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        map.current.scrollZoom.disable();

        map.current.setFog({
          color: 'rgb(5, 5, 8)',
          'high-color': 'rgb(20, 20, 25)',
          'horizon-blend': 0.2,
        });

        // Add country boundaries source and layer
        map.current.addSource('country-boundaries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1'
        });

        // Add visited countries layer
        map.current.addLayer({
          id: 'country-visited',
          type: 'fill',
          source: 'country-boundaries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': '#22c55e',
            'fill-opacity': 0.7,
            'fill-outline-color': '#22c55e'
          },
          filter: ['==', 'iso_3166_1_alpha_3', '']
        });

        // Add current country layer
        map.current.addLayer({
          id: 'country-current',
          type: 'fill',
          source: 'country-boundaries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': '#ea384c',
            'fill-opacity': 0.7,
            'fill-outline-color': '#ea384c'
          },
          filter: ['==', 'iso_3166_1_alpha_3', '']
        });

        setupGlobeRotation(map.current);
      });
    } catch (err) {
      setError('Failed to initialize the map. Please try refreshing the page.');
      console.error('Map initialization error:', err);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  return { mapContainer, map, error, isLoaded };
};

function setupGlobeRotation(map: mapboxgl.Map) {
  const secondsPerRevolution = 240;
  const maxSpinZoom = 5;
  const slowSpinZoom = 3;
  let userInteracting = false;
  let spinEnabled = true;

  function spinGlobe() {
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.getCenter();
      center.lng -= distancePerSecond;
      map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }

  map.on('mousedown', () => {
    userInteracting = true;
  });
  
  map.on('dragstart', () => {
    userInteracting = true;
  });
  
  map.on('mouseup', () => {
    userInteracting = false;
    spinGlobe();
  });
  
  map.on('touchend', () => {
    userInteracting = false;
    spinGlobe();
  });

  map.on('moveend', () => {
    spinGlobe();
  });

  spinGlobe();
}