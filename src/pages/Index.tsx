import React, { useState, useEffect } from 'react';
import Map from '@/components/Map';
import NotificationBar from '@/components/NotificationBar';
import { useCountdown } from '@/hooks/useCountdown';

const SANTA_START_DATE = new Date('2024-12-24T00:00:00');
const SANTA_END_DATE = new Date('2024-12-25T00:00:00');
const NORTH_POLE: [number, number] = [0, 90]; // Corrected North Pole coordinates

const getSantaLocation = (progress: number): [number, number] => {
  // Return North Pole for invalid progress
  if (progress <= 0 || progress >= 1 || isNaN(progress)) {
    return NORTH_POLE;
  }
  
  // Calculate longitude (-180 to 180 range)
  let longitude = -180 + (360 * progress);
  // Ensure longitude stays within valid range
  longitude = ((longitude + 180) % 360) - 180;
  
  // Calculate latitude (0 to 90 range for northern hemisphere)
  const latitudeProgress = Math.abs(Math.sin(progress * Math.PI * 2));
  const latitude = 45 + (45 * latitudeProgress); // Keep Santa in northern hemisphere between 45°N and 90°N
  
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