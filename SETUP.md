# Shuttle Tracker - Setup Guide

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
Navigate to `http://localhost:3000`

## Project Structure

```
shuttletrack/
├── app/
│   ├── api/gps/route.ts          # GPS API endpoint
│   ├── page.tsx                   # Home page with live map
│   ├── shuttle/page.tsx           # Shuttle details page
│   ├── stops/page.tsx             # Stops and ETA page
│   ├── about/page.tsx             # About page
│   ├── layout.tsx                 # Root layout with theme
│   └── globals.css                # Global styles + Leaflet
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── navbar.tsx                 # Navigation bar
│   ├── theme-toggle.tsx           # Dark mode toggle
│   ├── theme-provider.tsx         # Theme context
│   ├── shuttle-map.tsx            # Leaflet map component
│   └── floating-info-panel.tsx    # Info panel overlay
└── types/
    └── shuttle.ts                 # TypeScript types
```

## ESP32 Integration

Send GPS data to the API endpoint:

```cpp
// Arduino/ESP32 Example
#include <HTTPClient.h>
#include <ArduinoJson.h>

void sendGPSData(float lat, float lng, float speed) {
  HTTPClient http;
  http.begin("http://your-server/api/gps");
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<200> doc;
  doc["device_id"] = "SHUTTLE_01";
  doc["lat"] = lat;
  doc["lng"] = lng;
  doc["speed"] = speed;
  
  String json;
  serializeJson(doc, json);
  
  http.POST(json);
  http.end();
}
```

## Testing Without Hardware

Use curl to simulate GPS data:

```bash
curl -X POST http://localhost:3000/api/gps \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "SHUTTLE_01",
    "lat": 17.385,
    "lng": 78.486,
    "speed": 45.5
  }'
```

## Customization

### Update Shuttle Stops
Edit `app/stops/page.tsx`:
```typescript
const STOPS: Stop[] = [
  { id: "1", name: "Your Stop Name", lat: 17.385, lng: 78.486 },
  // Add more stops
];
```

### Update College Info
Edit `app/about/page.tsx` to add your college details.

### Change Map Center
Edit `components/shuttle-map.tsx`:
```typescript
center={[YOUR_LAT, YOUR_LNG]}
```

## Environment Variables

Create `.env.local` if needed:
```env
NEXT_PUBLIC_MAP_CENTER_LAT=17.385
NEXT_PUBLIC_MAP_CENTER_LNG=78.486
```

## Production Build

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

Or use any Node.js hosting platform.

## Features Checklist

- ✅ Live map with real-time updates
- ✅ Shuttle details page
- ✅ Stops with ETA calculations
- ✅ About page
- ✅ Dark mode toggle
- ✅ Mobile responsive
- ✅ Offline detection
- ✅ Toast notifications
- ✅ Smooth animations

## Troubleshooting

### Map not loading
- Check if leaflet CSS is imported
- Verify component is client-side only
- Check browser console for errors

### No shuttles showing
- Verify API endpoint is working
- Check GPS data format
- Ensure device_id is unique

### Dark mode not working
- Clear browser cache
- Check localStorage theme setting
- Verify ThemeProvider is wrapping app

## Support

For issues or questions, refer to the documentation or contact your development team.
