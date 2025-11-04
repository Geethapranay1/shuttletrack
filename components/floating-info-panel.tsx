"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShuttleData } from "@/types/shuttle";
import { MapPin, Gauge, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FloatingInfoPanelProps {
  shuttle: ShuttleData | null;
}

export function FloatingInfoPanel({ shuttle }: FloatingInfoPanelProps) {
  if (!shuttle) {
    return (
      <Card className="absolute bottom-6 left-6 right-6 md:left-6 md:right-auto w-[300px] shadow-xl z-10 bg-background/90 backdrop-blur-md border-none rounded-none overflow-hidden">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-muted-foreground font-medium uppercase tracking-wider">Waiting for GPS data...</p>
        </div>
      </Card>
    );
  }

  const timeDiff = new Date().getTime() - new Date(shuttle.updated).getTime();
  const isOffline = timeDiff > 60000;

  return (
    <Card className="absolute bottom-6 left-6 right-6 md:left-6 md:right-auto md:w-96 shadow-xl z-10 bg-background/90 backdrop-blur-md border-none rounded-none overflow-hidden">
      <div className="py-3 px-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg uppercase tracking-wider">{shuttle.device_id}</h3>
          <Badge variant={isOffline ? "destructive" : "default"} className="uppercase font-medium px-3 py-1 rounded-none">
            {isOffline ? "Offline" : "Live"}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-4 border-l-2 border-primary">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wider">
                <Gauge className="h-3 w-3" /> Speed
              </span>
              <span className="text-xl font-bold text-primary">
                {shuttle.speed.toFixed(1)} <span className="text-sm font-normal">km/h</span>
              </span>
            </div>
          </div>
          
          <div className="bg-muted/50 p-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wider">
                <Clock className="h-3 w-3" /> Updated
              </span>
              <span className="text-sm font-medium">
                {formatDistanceToNow(new Date(shuttle.updated), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/50 p-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wider">
              <MapPin className="h-3 w-3" /> Location
            </span>
            <span className="font-mono text-xs">
              {shuttle.lat.toFixed(6)}, {shuttle.lng.toFixed(6)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
