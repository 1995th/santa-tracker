import React from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface NotificationBarProps {
  currentLocation?: string;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ currentLocation }) => {
  const { days, hours, minutes, seconds, isLive } = useCountdown(new Date('2024-12-24T00:00:00'));

  return (
    <div className="fixed top-0 left-0 right-0 bg-santa-red text-white py-3 px-4 z-50 animate-notification-slide">
      <div className="container mx-auto">
        <div className="text-center font-medium tracking-wide">
          {!isLive ? (
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm sm:text-base">Santa takes off in:</span>
              <div className="flex space-x-2 sm:space-x-3">
                <span className="text-sm sm:text-base">{days}d</span>
                <span className="text-sm sm:text-base">{hours}h</span>
                <span className="text-sm sm:text-base">{minutes}m</span>
                <span className="text-sm sm:text-base">{seconds}s</span>
              </div>
            </div>
          ) : (
            <div className="text-sm sm:text-base">
              {currentLocation ? `Santa is currently in ${currentLocation}!` : 'Santa is on his way!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;