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
    <div className="fixed top-0 left-0 right-0 bg-santa-red text-white py-2 sm:py-3 px-2 sm:px-4 z-50">
      <div className="container mx-auto">
        <div className="text-center font-medium tracking-wide">
          {!isLive ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-base">Santa takes off in:</span>
              <div className="flex space-x-2 sm:space-x-3">
                {[
                  { value: days, label: 'd' },
                  { value: hours, label: 'h' },
                  { value: minutes, label: 'm' },
                  { value: seconds, label: 's' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-lg sm:text-2xl font-bold">{item.value}</span>
                    <span className="text-xs sm:text-sm ml-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-base animate-pulse">
              {currentLocation ? `Santa is currently in ${currentLocation}!` : 'Preparing for takeoff from the North Pole...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;