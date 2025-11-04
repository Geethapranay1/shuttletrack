"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ShuttleData } from "@/types/shuttle";

interface ShuttleMapProps {
  shuttles: ShuttleData[];
  center?: [number, number];
  zoom?: number;
}

function ShuttleMapComponent({ shuttles, center = [12.9692, 79.1559], zoom = 15 }: ShuttleMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const isInitializedRef = useRef(false);
  const currentZoomRef = useRef<number>(zoom);
  

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapContainerRef.current) return;
    
    if (!mapRef.current && !isInitializedRef.current && mapContainerRef.current) {

      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);
      currentZoomRef.current = zoom;
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapRef.current);
      
 
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);
      
      isInitializedRef.current = true;

    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        isInitializedRef.current = false;
      }
    };

  }, []); 
  

  useEffect(() => {
    if (!mapRef.current || !isInitializedRef.current) return;
    

    mapRef.current.invalidateSize();

  }, [center]);
  

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapRef.current || !isInitializedRef.current) return;
    
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  useEffect(() => {
    if (!mapRef.current || !isInitializedRef.current) return;
    
    const currentZoom = mapRef.current.getZoom();
    if (currentZoom !== zoom && currentZoomRef.current !== zoom) {
      mapRef.current.setZoom(zoom);
      currentZoomRef.current = zoom;
    }
  }, [zoom]);
  

  useEffect(() => {
    if (!mapRef.current || !isInitializedRef.current) {
      return;
    }
    
    const currentMarkers = new Set(markersRef.current.keys());
    
    shuttles.forEach(shuttle => {
      const markerColor = shuttle.speed > 5 ? '#ef4444' : '#f59e0b';
      
      // Extract a short identifier from device_id for display
      const displayId = shuttle.device_id.includes('_') 
        ? shuttle.device_id.split('_').pop()?.toUpperCase() || shuttle.device_id.slice(-2).toUpperCase()
        : shuttle.device_id.length > 6 
          ? shuttle.device_id.slice(-2).toUpperCase()
          : shuttle.device_id.toUpperCase();

      const markerHtml = `
        <div style="
          position: relative;
          width: 60px; 
          height: 60px; 
          background-color: ${markerColor};
          border-radius: 50%; 
          border: 5px solid white; 
          box-shadow: 0 0 0 3px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.5); 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          color: white; 
          font-weight: bold; 
          font-size: 16px;
          z-index: 9999 !important;
          pointer-events: auto;
        ">
          ${displayId}
        </div>
      `;
      
      const shuttleIcon = L.divIcon({
        html: markerHtml,
        className: 'shuttle-marker-custom',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -30]
      });
      
      const existing = markersRef.current.get(shuttle.device_id);
      
      if (existing) {

        const currentIcon = existing.getIcon() as L.DivIcon;
        const currentHtml = currentIcon.options.html as string;
        const newColor = shuttle.speed > 5 ? '#ef4444' : '#f59e0b';
        const currentColor = currentHtml.includes('#ef4444') ? '#ef4444' : '#f59e0b';
        

        if (currentColor !== newColor) {
          existing.setIcon(shuttleIcon);
        }
        

        const currentPos = existing.getLatLng();
        const hasChanged = Math.abs(currentPos.lat - shuttle.lat) > 0.000001 || 
                          Math.abs(currentPos.lng - shuttle.lng) > 0.000001;
        
        if (hasChanged) {

          existing.setLatLng([shuttle.lat, shuttle.lng]);
        }
        

        const popup = existing.getPopup();
        if (popup) {
          existing.setPopupContent(`
            <div style="padding: 10px; text-align: center;">
              <h3 style="font-weight: bold; margin-bottom: 5px;">${shuttle.device_id}</h3>
              <p>Speed: ${shuttle.speed.toFixed(1)} km/h</p>
              <p>Updated: ${new Date(shuttle.updated).toLocaleTimeString()}</p>
            </div>
          `);
        }
      } else {
        const marker = L.marker([shuttle.lat, shuttle.lng], { icon: shuttleIcon })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div style="padding: 10px; text-align: center;">
              <h3 style="font-weight: bold; margin-bottom: 5px;">${shuttle.device_id}</h3>
              <p>Speed: ${shuttle.speed.toFixed(1)} km/h</p>
              <p>Updated: ${new Date(shuttle.updated).toLocaleTimeString()}</p>
            </div>
          `);
        
        markersRef.current.set(shuttle.device_id, marker);
      }
      
      currentMarkers.delete(shuttle.device_id);
    });
    

    currentMarkers.forEach(deviceId => {
      const marker = markersRef.current.get(deviceId);
      if (marker) {
        marker.remove();
        markersRef.current.delete(deviceId);
      }
    });
    

  }, [shuttles]);
  
  return (
    <div className="w-full h-full relative" style={{ minHeight: '700px' }}>
      <div 
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ 
          height: '100%', 
          width: '100%', 
          position: 'relative',
          zIndex: 0
        }}
      />
    </div>
  );
}

export default ShuttleMapComponent;
export { ShuttleMapComponent as ShuttleMap };
