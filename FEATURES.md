# College Shuttle Tracker - Features Documentation

## Overview
A modern, real-time shuttle tracking system built with Next.js, React, and TailwindCSS, designed for college campus transportation monitoring.

## Pages

### 1. Home Page (Main Map View) - `/`
- **Full-screen live map** displaying all active shuttles
- **Real-time updates** every 5 seconds
- **Interactive markers** with popup information
- **Floating info panel** showing:
  - Shuttle ID
  - GPS coordinates (lat/lng)
  - Current speed
  - Last update time
  - Online/Offline status
- **Manual refresh button** with loading indicator
- **Responsive design** for mobile and desktop
- **Automatic map bounds** adjustment based on shuttle positions

### 2. Shuttle Details Page - `/shuttle`
- **Shuttle list sidebar** showing all active shuttles
- **Detailed information card** for selected shuttle:
  - GPS coordinates
  - Speed in km/h
  - Last update timestamp
  - Movement status (Moving/Stationary)
- **Embedded map view** centered on selected shuttle
- **Live status badges** (Live/Offline)
- **Click-to-select** shuttle interaction
- **Auto-refresh** every 5 seconds

### 3. Stops Page - `/stops`
- **Grid view** of all shuttle stops
- **Stop information**:
  - Stop name
  - GPS coordinates
  - Nearest shuttle
  - Distance to stop
  - Estimated arrival time (ETA)
- **Smart ETA calculation** based on:
  - Current distance
  - Shuttle speed
  - Movement status
- **Active shuttles summary** card
- **Real-time updates** for all calculations

### 4. About Page - `/about`
- **System overview** with visual cards
- **How it works** section with icons:
  - ESP32 GPS devices
  - Live data transmission
  - Real-time map view
  - ETA calculations
- **Technology stack** documentation
- **College information** section
- **Contact details** and support info

## Components

### Core Components

#### `Navbar`
- **Responsive navigation** with active page highlighting
- **Logo and branding** with shuttle icon
- **Theme toggle** integration
- **Mobile-friendly** hamburger menu

#### `ThemeToggle`
- **Dark/Light mode** switcher
- **System theme** support
- **Smooth transitions**
- **Persistent preference**

#### `ShuttleMap`
- **Leaflet-based** interactive map
- **Custom bus icons** with primary color
- **Smooth marker animations**
- **Auto-fit bounds** for multiple shuttles
- **Popup information** on marker click
- **OpenStreetMap** tiles

#### `FloatingInfoPanel`
- **Contextual information** display
- **Live status indicator**
- **Formatted timestamps** with relative time
- **GPS coordinates** in decimal format
- **Speed display** in km/h
- **Responsive positioning**

## Features

### Real-Time Updates
- **Auto-refresh** every 5 seconds
- **WebSocket-ready** architecture (can be upgraded)
- **Smooth data transitions**
- **No page reload** required

### Status Monitoring
- **Offline detection** (no update > 1 minute)
- **Toast notifications** for status changes
- **Visual status badges**
- **Warning indicators**

### Dark Mode
- **System preference** detection
- **Manual toggle** available
- **Consistent theming** across all pages
- **Smooth transitions**

### Mobile Optimization
- **Responsive layout** for all screen sizes
- **Touch-friendly** controls
- **Optimized map** interactions
- **Mobile-first** design approach

### Error Handling
- **Graceful API failures**
- **User-friendly error messages**
- **Loading states** everywhere
- **Fallback content** when no data

### Performance
- **Lazy loading** for map component
- **Optimized re-renders**
- **Efficient state management**
- **Minimal bundle size**

## API Integration

### Endpoints

#### `POST /api/gps`
Receive GPS data from ESP32 devices
```json
{
  "device_id": "SHUTTLE_01",
  "lat": 17.385,
  "lng": 78.486,
  "speed": 45.5
}
```

#### `GET /api/gps`
Fetch all shuttles or specific shuttle
```
GET /api/gps - All shuttles
GET /api/gps?device_id=SHUTTLE_01 - Specific shuttle
```

## Design System

### Color Scheme
- **Primary**: Orange theme
- **Background**: Light/Dark adaptive
- **Accent**: Custom shadcn/ui palette
- **Consistent**: All components themed

### Typography
- **Font Family**: System fonts (Oxanium)
- **Font Sizes**: Responsive scaling
- **Font Weights**: Semantic hierarchy

### Spacing
- **Consistent gaps**: Using Tailwind spacing scale
- **Card padding**: Standardized across components
- **Container**: Max-width constraints

### Animations
- **Smooth transitions**: 200-300ms duration
- **Hover effects**: Subtle interactions
- **Loading states**: Spinner animations
- **Map markers**: Smooth position updates

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility
- **Semantic HTML** structure
- **ARIA labels** where needed
- **Keyboard navigation** support
- **Color contrast** compliance

## Future Enhancements
- WebSocket for real-time updates (no polling)
- Route visualization
- Historical tracking
- Push notifications
- PWA support
- Offline mode
- Multiple routes support
- Driver profiles
