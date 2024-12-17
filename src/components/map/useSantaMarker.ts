import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export const useSantaMarker = (map: mapboxgl.Map | null, santaLocation?: [number, number]) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !santaLocation) return;

    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'santa-marker';
      el.innerHTML = '🎅';
      el.style.fontSize = '2rem';

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat(santaLocation)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(santaLocation);
    }

    map.flyTo({
      center: santaLocation,
      zoom: 3,
      duration: 2000,
    });
  }, [map, santaLocation]);

  return markerRef;
};