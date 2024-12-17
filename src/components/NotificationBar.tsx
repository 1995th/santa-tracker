import React from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { useIsMobile } from '@/hooks/use-mobile';

interface NotificationBarProps {
  currentLocation?: string;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ currentLocation }) => {
  const { days, hours, minutes, seconds, isLive } = useCountdown(new Date('2024-12-24T00:00:00'));
  const isMobile = useIsMobile();

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-santa-red text-white py-2 px-4 rounded-full shadow-lg">
        <div className="text-center font-medium tracking-wide">
          {!isLive ? (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-xs sm:text-sm whitespace-nowrap">Santa takes off in:</span>
              <div className="flex space-x-2">
                {[
                  { value: days, label: 'd' },
                  { value: hours, label: 'h' },
                  { value: minutes, label: 'm' },
                  { value: seconds, label: 's' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-sm sm:text-base font-bold">{item.value}</span>
                    <span className="text-xs ml-0.5">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-sm whitespace-nowrap animate-pulse">
              {currentLocation ? `Santa is currently in ${currentLocation}!` : 'Preparing for takeoff from the North Pole...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;