# Santa Tracker Overview

This is a real-time Santa tracking application that shows Santa's journey on Christmas Eve (December 24, 2024). It features an interactive 3D globe using Mapbox, with live updates of Santa's location and journey statistics.

## Key Components:

### Interactive Map (Map.tsx)

- Displays a 3D globe with Santa's current position
- Shows visited locations in green
- Current location highlighted in red
- Includes a legend explaining the markers
- Features a snow overlay effect
  
### Notification Bar (NotificationBar.tsx)

- Shows countdown until Santa's journey begins
- Displays current location once journey is active
- Styled as a pill-shaped container in the top-left corner
- Journey Stats (JourneyStats.tsx)

### Real-time statistics including:

- Presents delivered
- Cookies eaten
- Distance traveled
- Updates automatically using Supabase real-time subscriptions

## Database Structure (Supabase):

### santa_journey table:

- Location name, coordinates (latitude/longitude)
- Arrival time
- Presents delivered at each stop
- Cookies eaten
- Local weather data
- Fun facts about each location
- Distance to next destination

### journey_status table:

- Active/inactive state
- Start and end times
- Current location reference
- Total statistics (presents, cookies, distance)

### Database Functions:

- An automatic trigger (update_journey_stats_trigger) runs after any insert or update to santa_journey
- The update_journey_stats() function automatically calculates and updates total statistics in the journey_status table
- Real-time updates are implemented using Supabase's real-time subscriptions, ensuring the UI updates instantly when the database changes

### Data Flow:

- The database is updated with Santa's new location
- Triggers automatically update journey statistics
- Real-time subscriptions notify the frontend
- UI components (map, stats, notification bar) update automatically
  
The app is designed to go live on December 24, 2024, at 12:00 AM, when it will begin tracking Santa's journey in real-time.
