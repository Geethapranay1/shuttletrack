"use client";

import { useEffect, useState } from "react";
import { FloatingInfoPanel } from "@/components/floating-info-panel";
import { Navbar } from "@/components/navbar";
import { ShuttleData } from "@/types/shuttle";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";

const ShuttleMap = dynamic(() => import("@/components/shuttle-map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted rounded-lg animate-pulse" />,
});

export default function Home() {
  const [shuttles, setShuttles] = useState<ShuttleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShuttles = async (showToast = false) => {
    try {
      setRefreshing(true);
      // Add cache-busting and ensure fresh data
      const res = await fetch("/api/gps", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setShuttles(data);
        
        data.forEach((shuttle) => {
          const timeDiff = new Date().getTime() - new Date(shuttle.updated).getTime();
          if (timeDiff > 60000 && showToast) {
            toast.warning(`${shuttle.device_id} is offline`);
          }
        });
      } else if (data.message) {
        setShuttles([]);
      }
    } catch {
      toast.error("Failed to fetch shuttle data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShuttles();

    const interval = setInterval(() => fetchShuttles(true), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 relative pt-16 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium uppercase">Loading map...</p>
          </div>
        ) : (
          <div className="w-full h-[calc(100vh-4rem)] relative">
            <div className="w-full h-full absolute inset-0">
              <ShuttleMap shuttles={shuttles} />
            </div>
            <FloatingInfoPanel shuttle={shuttles[0] || null} />
            <Button
              size="icon"
              variant="outline"
              className="absolute top-4 right-4 z-10 shadow-md bg-background/80 backdrop-blur-sm rounded-none h-10 w-10"
              onClick={() => fetchShuttles(false)}
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""} text-primary`} />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
