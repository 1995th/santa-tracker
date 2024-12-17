import React from 'react';
import Map from '@/components/Map';
import NotificationBar from '@/components/NotificationBar';
import { useCountdown } from '@/hooks/useCountdown';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SANTA_START_DATE = new Date('2024-12-24T00:00:00');
const NORTH_POLE: [number, number] = [0, 90];

const Index = () => {
  const { isLive } = useCountdown(SANTA_START_DATE);

  // Fetch current journey status
  const { data: journeyStatus } = useQuery({
    queryKey: ['journeyStatus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journey_status')
        .select('*, current_location:santa_journey(*)')
        .single();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 1000,
    enabled: isLive, // Only fetch when it's live
  });

  // Fetch all journey points
  const { data: journeyPoints } = useQuery({
    queryKey: ['journeyPoints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('santa_journey')
        .select('*')
        .order('arrival_time', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: isLive, // Only fetch when it's live
  });

  // Before Dec 24, or if no current location is set, use North Pole
  const currentLocation = isLive ? journeyStatus?.current_location : null;
  const santaLocation: [number, number] = currentLocation 
    ? [currentLocation.longitude, currentLocation.latitude]
    : NORTH_POLE;

  // Only include visited locations if we're live and have journey points
  const visitedLocations: [number, number][] = isLive && journeyPoints
    ? journeyPoints
      .filter(point => new Date(point.arrival_time) < new Date())
      .map(point => [point.longitude, point.latitude])
    : [];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-santa-dark">
      <NotificationBar currentLocation={currentLocation?.location_name} />
      <Map santaLocation={santaLocation} visitedLocations={visitedLocations} />
    </main>
  );
};

export default Index;