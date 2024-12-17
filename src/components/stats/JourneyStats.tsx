import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Gift, Cookie, Route } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const JourneyStats = () => {
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['journeyStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journey_status')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('journey-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journey_status'
        },
        (payload) => {
          // Invalidate and refetch the query when we receive an update
          queryClient.invalidateQueries({ queryKey: ['journeyStats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="fixed bottom-8 right-8 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white z-10">
      <div className="flex flex-col gap-2">
        <HoverCard>
          <HoverCardTrigger>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>{stats?.total_presents_delivered?.toLocaleString() || 0} Presents Delivered</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p>Total presents delivered by Santa this Christmas Eve!</p>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger>
            <div className="flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              <span>{stats?.total_cookies_eaten?.toLocaleString() || 0} Cookies Eaten</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p>Number of cookies Santa has enjoyed during his journey!</p>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger>
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              <span>{Math.round(stats?.total_distance_traveled || 0).toLocaleString()} km Traveled</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p>Total distance Santa has traveled delivering presents!</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default JourneyStats;