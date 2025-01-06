import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import type { Earthquake } from "@/lib/types";

interface MapProps {
  earthquakes?: Earthquake[];
}

const getMarkerColor = (magnitude: number): string => {
  if (magnitude >= 7) return "#FF0000"; // Red for severe
  if (magnitude >= 5) return "#FFA500"; // Orange for strong
  if (magnitude >= 3) return "#FFFF00"; // Yellow for moderate
  return "#00FF00"; // Green for light
};

const Map = ({ earthquakes }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [0, 0],
        zoom: 2,
      });

      map.current.on('load', () => {
        setIsMapInitialized(true);
        
        // Add navigation controls
        map.current?.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Get user location only after map is loaded
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
        description: "Failed to initialize the map. Please check your Mapbox token.",
        variant: "destructive",
      });
    }
  }, [mapboxToken, toast]);

  // Add earthquake markers only after map is initialized
  useEffect(() => {
    if (!map.current || !earthquakes || !isMapInitialized) return;

    try {
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
    } catch (error) {
      console.error("Error adding earthquake markers:", error);
      toast({
        title: "Marker Error",
        description: "Failed to add earthquake markers to the map",
        variant: "destructive",
      });
    }
  }, [earthquakes, isMapInitialized, toast]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden border border-mint/20 flex items-center justify-center">
        <div className="max-w-md p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Mapbox Token Required</h2>
          <p className="text-sm text-gray-400 mb-4">
            Please enter your Mapbox public token to initialize the map. You can find this in your Mapbox account dashboard.
          </p>
          <input
            type="text"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Enter your Mapbox token"
            className="w-full p-2 mb-4 rounded border border-mint/20 bg-transparent text-white"
          />
          <p className="text-xs text-gray-500">
            Visit <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-mint hover:underline">mapbox.com</a> to get your token
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-mint/20">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
