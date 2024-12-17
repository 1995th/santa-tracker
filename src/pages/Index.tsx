import React, { useState, useEffect } from 'react';
import Map from '@/components/Map';
import NotificationBar from '@/components/NotificationBar';
import { useCountdown } from '@/hooks/useCountdown';

const SANTA_START_DATE = new Date('2024-12-24T00:00:00');
const SANTA_END_DATE = new Date('2024-12-25T00:00:00');
const NORTH_POLE: [number, number] = [-90, 90];

// Simulated Santa route - in production this would come from a backend
const getSantaLocation = (progress: number): [number, number] => {
  // Always return North Pole if progress is 0 or invalid
  if (progress <= 0 || isNaN(progress)) return NORTH_POLE;
  if (progress >= 1) return NORTH_POLE; // Return to North Pole when done
  
  // Simple circular route around the globe
  const longitude = -180 + (360 * progress);
  // Ensure latitude stays within valid range (-90 to 90)
  const latitude = Math.min(Math.max(-90, 20 * Math.sin(progress * Math.PI * 2)), 90);
  
  // Ensure both values are valid numbers
  if (isNaN(longitude) || isNaN(latitude)) return NORTH_POLE;
  
  return [longitude, latitude];
};

const getLocationName = (progress: number): string => {
  if (progress <= 0 || isNaN(progress)) return "North Pole";
  
  // This would be replaced with actual location data in production
  const locations = [
    "North Pole", "Tokyo", "Sydney", "Delhi", "Dubai",
    "Moscow", "Paris", "London", "New York", "Los Angeles"
  ];
  const index = Math.floor(progress * locations.length) % locations.length;
  return locations[index];
};

const Index = () => {
  const { isLive } = useCountdown(SANTA_START_DATE);
  const [santaLocation, setSantaLocation] = useState<[number, number]>(NORTH_POLE);
  const [currentLocation, setCurrentLocation] = useState<string>("North Pole");

  useEffect(() => {
    if (!isLive) {
      setSantaLocation(NORTH_POLE);
      setCurrentLocation("North Pole");
      return;
    }

    const updateSantaPosition = () => {
      const now = new Date();
      const totalDuration = SANTA_END_DATE.getTime() - SANTA_START_DATE.getTime();
      const elapsed = now.getTime() - SANTA_START_DATE.getTime();
      const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);

      const location = getSantaLocation(progress);
      const locationName = getLocationName(progress);

      setSantaLocation(location);
      setCurrentLocation(locationName);
    };

    const interval = setInterval(updateSantaPosition, 1000);
    updateSantaPosition();

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-santa-dark">
      <NotificationBar currentLocation={currentLocation} />
      <Map santaLocation={santaLocation} />
    </main>
  );
};

export default Index;