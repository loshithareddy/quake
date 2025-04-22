
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import type { Earthquake } from "@/lib/types";

interface MapProps {
  earthquakes?: Earthquake[];
}

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFydGgxMjMiLCJhIjoiY201bGtwNWk5MW9jNDJpc2Rzazd3bDRzNCJ9.w4fTRntk2IsCm1B_hjfb1g";

const getMarkerColor = (magnitude: number): string => {
  if (magnitude >= 7) return "#ea384c"; // High risk - Red
  if (magnitude >= 5) return "#F97316"; // Medium risk - Orange
  if (magnitude >= 3) return "#22c55e"; // Low risk - Green
  return "#22c55e"; // Default - Green
};

const Map = ({ earthquakes }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [78.9629, 20.5937], // Center on India
        zoom: 4,
      });

      map.current.on('load', () => {
        setIsMapInitialized(true);
        
        // Add navigation controls
        map.current?.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation([longitude, latitude]);
              
              if (map.current) {
                new mapboxgl.Marker({ color: "#64FFDA" })
                  .setLngLat([longitude, latitude])
                  .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))
                  .addTo(map.current);

                toast({
                  title: "Location found",
                  description: "Your location has been added to the map",
                });
              }
            },
            () => {
              toast({
                title: "Location error",
                description: "Unable to get your location",
                variant: "destructive",
              });
            }
          );
        }
      });

      return () => {
        map.current?.remove();
        setIsMapInitialized(false);
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "Failed to initialize the map",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Add earthquake markers
  useEffect(() => {
    if (!map.current || !earthquakes || !isMapInitialized) return;

    try {
      // Remove existing markers
      const markers = document.getElementsByClassName("mapboxgl-marker");
      while (markers[0]) {
        markers[0].remove();
      }

      // Add new markers with risk-based colors
      earthquakes.forEach((eq) => {
        const color = getMarkerColor(eq.magnitude);
        
        // Create marker element with pulse effect
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = color;
        el.style.boxShadow = `0 0 0 2px ${color}33`;
        el.style.animation = 'pulse 2s infinite';
        
        new mapboxgl.Marker({ element: el })
          .setLngLat([eq.longitude, eq.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <div class="p-3 rounded-lg">
                <h3 class="font-bold text-gray-900">Magnitude ${eq.magnitude}</h3>
                <p class="text-gray-700">Depth: ${eq.depth}km</p>
                <p class="text-gray-700">Location: ${eq.place}</p>
                <p class="text-gray-700">Time: ${new Date(eq.time).toLocaleString()}</p>
              </div>
            `)
          )
          .addTo(map.current);
      });
    } catch (error) {
      console.error("Error adding earthquake markers:", error);
      toast({
        title: "Marker Error",
        description: "Failed to add earthquake markers to the map",
        variant: "destructive",
      });
    }
  }, [earthquakes, isMapInitialized, toast]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-forest/20 seismic-card">
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(234, 56, 76, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(234, 56, 76, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(234, 56, 76, 0);
            }
          }
        `}
      </style>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
