import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import type { Earthquake } from "@/lib/types";

interface MapProps {
  earthquakes?: Earthquake[];
}

const Map = ({ earthquakes }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = "pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHNlOXBtYmowMGRqMmptbGVwOWF1NXB2In0.qHvQhxzr7Z7R0delJFiXXw";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 0],
      zoom: 2,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          // Add user marker
          new mapboxgl.Marker({ color: "#64FFDA" })
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))
            .addTo(map.current!);

          toast({
            title: "Location found",
            description: "Your location has been added to the map",
          });
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

    return () => {
      map.current?.remove();
    };
  }, [toast]);

  // Add earthquake markers
  useEffect(() => {
    if (!map.current || !earthquakes) return;

    // Remove existing markers
    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) {
      markers[0].remove();
    }

    // Add new markers
    earthquakes.forEach((eq) => {
      const color = getMarkerColor(eq.magnitude);
      
      new mapboxgl.Marker({ color })
        .setLngLat([eq.longitude, eq.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-bold">Magnitude ${eq.magnitude}</h3>
              <p>Depth: ${eq.depth}km</p>
              <p>Location: ${eq.place}</p>
              <p>Time: ${new Date(eq.time).toLocaleString()}</p>
            </div>
          `)
        )
        .addTo(map.current);
    });
  }, [earthquakes]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-mint/20">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

// Helper function to determine marker color based on magnitude
const getMarkerColor = (magnitude: number): string => {
  if (magnitude >= 7) return "#FF0000";
  if (magnitude >= 5) return "#FFA500";
  if (magnitude >= 3) return "#FFFF00";
  return "#00FF00";
};

export default Map;