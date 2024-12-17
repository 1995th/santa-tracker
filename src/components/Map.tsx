import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  santaLocation?: [number, number];
}

const Map: React.FC<MapProps> = ({ santaLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setError('WebGL is not supported in your browser. Please try using a different browser or device.');
      return;
    }

    try {
      mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your token
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [0, 20],
        pitch: 45,
        failIfMajorPerformanceCaveat: false, // Add this to be more permissive with WebGL capabilities
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.scrollZoom.disable();

      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(5, 5, 8)',
          'high-color': 'rgb(20, 20, 25)',
          'horizon-blend': 0.2,
        });
      });

      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;
      let spinEnabled = true;

      function spinGlobe() {
        if (!map.current || santaLocation) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.current.on('mousedown', () => {
        userInteracting = true;
      });
      
      map.current.on('dragstart', () => {
        userInteracting = true;
      });
      
      map.current.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
      });
      
      map.current.on('touchend', () => {
        userInteracting = false;
        spinGlobe();
      });

      map.current.on('moveend', () => {
        spinGlobe();
      });

      spinGlobe();
    } catch (err) {
      setError('Failed to initialize the map. Please try refreshing the page.');
      console.error('Map initialization error:', err);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !santaLocation) return;

    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'santa-marker';
      el.innerHTML = '🎅';
      el.style.fontSize = '2rem';

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat(santaLocation)
        .addTo(map.current);
    } else {
      markerRef.current.setLngLat(santaLocation);
    }

    map.current.flyTo({
      center: santaLocation,
      zoom: 3,
      duration: 2000,
    });
  }, [santaLocation]);

  if (error) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-santa-dark text-white p-4 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Map Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;