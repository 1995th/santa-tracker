import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MapProps {
  santaLocation?: [number, number];
}

const MAPBOX_TOKEN_KEY = 'mapbox_token';

const Map: React.FC<MapProps> = ({ santaLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>(() => localStorage.getItem(MAPBOX_TOKEN_KEY) || '');
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem(MAPBOX_TOKEN_KEY));

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(MAPBOX_TOKEN_KEY, token);
    setShowTokenInput(false);
    window.location.reload(); // Reload to initialize map with new token
  };

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setError('WebGL is not supported in your browser. Please try using a different browser or device.');
      return;
    }

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [0, 20],
        pitch: 45,
        failIfMajorPerformanceCaveat: false,
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
      setError('Failed to initialize the map. Please check your Mapbox token and try refreshing the page.');
      console.error('Map initialization error:', err);
    }

    return () => {
      map.current?.remove();
    };
  }, [token]);

  if (showTokenInput) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-santa-dark p-4">
        <form onSubmit={handleTokenSubmit} className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold text-white text-center">Enter your Mapbox Token</h2>
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your Mapbox public token"
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Save Token
          </Button>
          <p className="text-sm text-gray-400 text-center">
            You can find your public token in the{" "}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Mapbox tokens page
            </a>
          </p>
        </form>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-santa-dark text-white p-4 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Map Error</h2>
          <p>{error}</p>
          <Button
            onClick={() => {
              localStorage.removeItem(MAPBOX_TOKEN_KEY);
              setShowTokenInput(true);
            }}
            className="mt-4"
          >
            Change Mapbox Token
          </Button>
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
