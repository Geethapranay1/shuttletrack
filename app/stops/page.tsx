"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShuttleData, Stop } from "@/types/shuttle";
import { MapPin, Navigation } from "lucide-react";

const STOPS: Stop[] = [
  { id: "1", name: "Main Gate", lat: 12.9692, lng: 79.1559 },
  { id: "2", name: "Men's Hostel", lat: 12.9699, lng: 79.1552 },
  { id: "3", name: "Technology Tower", lat: 12.9707, lng: 79.1588 },
  { id: "4", name: "Silver Jubilee Tower", lat: 12.9690, lng: 79.1575 },
  { id: "5", name: "Anna Auditorium", lat: 12.9684, lng: 79.1565 },
  { id: "6", name: "Food Court", lat: 12.9702, lng: 79.1567 },
];

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function estimateArrival(distance: number, speed: number): string {
  if (speed < 5) return "Stationary";
  const hours = distance / speed;
  const minutes = Math.round(hours * 60);
  if (minutes < 1) return "Arriving";
  if (minutes < 60) return `${minutes} min`;
  return `${Math.round(hours)} hr`;
}

export default function StopsPage() {
  const [shuttles, setShuttles] = useState<ShuttleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShuttles = useCallback(async () => {
    try {
      const res = await fetch("/api/gps");
      const data = await res.json();
      if (Array.isArray(data)) {
        setShuttles(data);
      }
    } catch {
      console.error("Failed to fetch shuttles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
  
    fetchShuttles();
    
    // Set up interval for subsequent fetches
    const interval = setInterval(fetchShuttles, 5000);
    return () => clearInterval(interval);
  }, [fetchShuttles]);

  const getNearestShuttle = (stop: Stop) => {
    if (shuttles.length === 0) return null;
    
    const shuttlesWithDistance = shuttles.map((shuttle) => ({
      shuttle,
      distance: calculateDistance(stop.lat, stop.lng, shuttle.lat, shuttle.lng),
    }));

    return shuttlesWithDistance.reduce((nearest, current) =>
      current.distance < nearest.distance ? current : nearest
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-3 pt-24">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-wider">VIT Vellore Shuttle Stops</h1>
        <p className="text-sm text-muted-foreground uppercase">Estimated arrival times at campus locations</p>
      </div>
      
      <main className="flex-1 container py-6 justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium">Loading stop information...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3">
              {STOPS.map((stop) => {
                const nearest = getNearestShuttle(stop);
                return (
                  <Card key={stop.id} className="overflow-hidden border-border shadow-md rounded-none hover:shadow-lg transition-shadow">
                    <div className="py-3 px-4">
                      <CardTitle className="flex items-center justify-between">
                        <span>{stop.name}</span>
                        <MapPin className="h-5 w-5" />
                      </CardTitle>
                    </div>
                    
                    <CardContent className="p-4 space-y-4">
                      <div className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
                        {stop.lat.toFixed(6)}, {stop.lng.toFixed(6)}
                      </div>

                      {nearest && shuttles.length > 0 ? (
                        <div className="space-y-4">
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Nearest Shuttle</span>
                              <Badge variant="secondary" className="font-medium">
                                {nearest.shuttle.device_id}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Navigation className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {nearest.distance.toFixed(2)} km away
                              </span>
                            </div>
                          </div>

                          <div className="bg-accent p-4 rounded-lg text-center">
                            <div className="text-xs text-accent-foreground font-medium mb-1">ESTIMATED ARRIVAL</div>
                            <div className="text-2xl font-bold text-primary">
                              {estimateArrival(nearest.distance, nearest.shuttle.speed)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted p-6 rounded-none text-center">
                          <p>
                            No shuttles active
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="overflow-hidden border-border shadow-md rounded-none">
              <div className="py-3 px-4">
                <CardTitle>Active Shuttles</CardTitle>
              </div>
              <CardContent className="p-4">
                {shuttles.length === 0 ? (
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <p className="text-muted-foreground">
                      No shuttles currently active
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {shuttles.map((shuttle) => (
                      <div
                        key={shuttle.device_id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-accent/10 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{shuttle.device_id}</p>
                          <p className="text-sm text-muted-foreground">
                            Speed: {shuttle.speed.toFixed(1)} km/h
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          Live
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
