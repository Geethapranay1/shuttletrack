"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShuttleData } from "@/types/shuttle";
import { MapPin, Gauge, Clock, Bus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";

const ShuttleMap = dynamic(() => import("@/components/shuttle-map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted rounded-lg animate-pulse" />,
});

export default function ShuttlePage() {
  const [shuttles, setShuttles] = useState<ShuttleData[]>([]);
  const [selectedShuttle, setSelectedShuttle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShuttles = async () => {
    try {
      // Add cache-busting to ensure fresh data
      const res = await fetch("/api/gps", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setShuttles(data);
        if (!selectedShuttle && data.length > 0) {
          setSelectedShuttle(data[0].device_id);
        }
      }
      if (isLoading) {
        setIsLoading(false);
      }
    } catch {
      console.error("Failed to fetch shuttles");
    }
  };

  // Set up polling interval and do initial fetch
  useEffect(() => {
    // Do initial fetch
    const initialFetch = async () => {
      try {
        const res = await fetch("/api/gps", {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setShuttles(data);
          if (!selectedShuttle && data.length > 0) {
            setSelectedShuttle(data[0].device_id);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch shuttles", error);
      }
    };
    
    // Execute initial fetch
    initialFetch();
    
    // Set up polling interval
    const interval = setInterval(fetchShuttles, 1000);
    return () => clearInterval(interval);
  }, [selectedShuttle]);

  const shuttle = shuttles.find((s) => s.device_id === selectedShuttle);
  const timeDiff = shuttle ? new Date().getTime() - new Date(shuttle.updated).getTime() : 0;
  const isOffline = timeDiff > 60000;

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <Navbar />
      <div className="container mx-auto px-4 py-3 pt-28">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-wider">Shuttle Details</h1>
        <p className="text-sm uppercase">Information about active shuttles</p>
      </div>
      <main className="flex-1 container py-6 space-y-6">

        <div className="grid md:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Active Shuttles</h2>
            {shuttles.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-center">
                    No active shuttles
                  </p>
                </CardContent>
              </Card>
            ) : (
              shuttles.map((s) => {
                const diff = new Date().getTime() - new Date(s.updated).getTime();
                const offline = diff > 60000;
                return (
                  <Card
                    key={s.device_id}
                    className={`cursor-pointer transition-colors border-2 ${selectedShuttle === s.device_id 
                      ? "border-primary ring-1 ring-primary ring-offset-2" 
                      : "border-border hover:border-primary/30"}`}
                    onClick={() => setSelectedShuttle(s.device_id)}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{s.device_id}</h3>
                          <Badge variant={offline ? "destructive" : "outline"} className={offline ? "" : "bg-primary/10 text-primary border-primary/20"}>
                            {offline ? "Offline" : "Live"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4" />
                          <p className="text-sm">
                            <span className="text-primary font-medium">{s.speed.toFixed(1)}</span> km/h
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            {shuttle ? (
              <>
                <Card className="overflow-hidden border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{shuttle.device_id}</CardTitle>
                      <Badge variant={isOffline ? "destructive" : "outline"} className={isOffline ? "" : "bg-primary-foreground/10 border-primary-foreground/20"}>
                        {isOffline ? "Offline" : "Live"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-primary/10 rounded-none">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">Location</p>
                        </div>
                        <p className="text-xs font-mono bg-background/50 p-2 rounded border-border border">
                          {shuttle.lat.toFixed(6)}, {shuttle.lng.toFixed(6)}
                        </p>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-primary/10 rounded">
                            <Gauge className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Speed</p>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {shuttle.speed.toFixed(1)} <span className="text-sm font-normal">km/h</span>
                        </p>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-primary/10 rounded">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Last Updated</p>
                        </div>
                        <p className="text-sm">
                          {formatDistanceToNow(new Date(shuttle.updated), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-primary/10 rounded">
                            <Bus className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Status</p>
                        </div>
                        <p className="text-sm font-medium">
                          <span className={`inline-block px-2 py-1 rounded ${shuttle.speed > 5 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {shuttle.speed > 5 ? "Moving" : "Stationary"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-border">
                  <CardHeader>
                    <CardTitle>Live Location</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[400px] w-full relative overflow-hidden rounded-lg border-2 border-primary/20">
                      <div className="w-full h-full absolute inset-0">
                        <ShuttleMap
                          shuttles={shuttles}
                          center={[shuttle.lat, shuttle.lng]}
                          zoom={13}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-dashed border-border">
                <CardContent className="py-16 flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-muted rounded-full">
                    <Bus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    Select a shuttle to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
