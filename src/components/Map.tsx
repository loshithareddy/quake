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
  return "#22c55e"; // Low risk - Green
};

const Map = ({ earthquakes }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { toast } = useToast();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [78.9629, 20.5937], // Center on India
        zoom: 4,
        minZoom: 3,
        pitch: 30,
      });

      map.current.on('load', () => {
        setIsMapInitialized(true);

        // Add navigation controls
        map.current?.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.current?.addControl(new mapboxgl.FullscreenControl(), "top-right");
        map.current?.addControl(new mapboxgl.ScaleControl(), "bottom-left");

        // Add 3D terrain
        map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

        // Add the DEM source
        map.current?.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation([longitude, latitude]);

              if (map.current) {
                // Fly to user location with animation
                map.current.flyTo({
                  center: [longitude, latitude],
                  zoom: 6,
                  speed: 0.8,
                  curve: 1,
                  easing(t) {
                    return t;
                  }
                });

                // Add user marker (cyan color, not affected by risk coloring)
                new mapboxgl.Marker({
                  color: "#64FFDA",
                  scale: 1.2
                })
                  .setLngLat([longitude, latitude])
                  .setPopup(new mapboxgl.Popup({
                    closeButton: false,
                    className: 'custom-popup'
                  }).setHTML("<h3>Your Location</h3>"))
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

  useEffect(() => {
    if (!map.current || !earthquakes || !isMapInitialized) return;

    try {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      earthquakes.forEach((eq) => {
        let color = "#22c55e";
        if (eq.magnitude >= 7) color = "#ea384c"; // Red for high risk
        else if (eq.magnitude >= 5) color = "#F97316"; // Orange for medium
        // else green (already #22c55e)

        const size = eq.magnitude >= 7 ? 26 : eq.magnitude >= 5 ? 22 : 16;
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = color;
        el.style.boxShadow = `0 0 0 2px ${color}88`; // Better visible border
        el.style.animation = 'pulse 2s infinite';

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([eq.longitude, eq.latitude])
          .setPopup(
            new mapboxgl.Popup({
              closeButton: false,
              maxWidth: "320px",
              className: 'earthquake-popup'
            }).setHTML(`
              <div class="p-3 rounded-lg">
                <h3 class="font-bold text-gray-900">Magnitude ${eq.magnitude}</h3>
                <p class="text-gray-700">Depth: ${eq.depth}km</p>
                <p class="text-gray-700">Location: ${eq.place}</p>
                <p class="text-gray-700">Time: ${new Date(eq.time).toLocaleString()}</p>
                <span class="inline-block px-2 py-1 mt-2 rounded-full text-xs ${eq.magnitude >= 7
                    ? 'bg-red-100 text-red-800'
                    : eq.magnitude >= 5
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }">
                  ${eq.magnitude >= 7 ? 'High Risk' : eq.magnitude >= 5 ? 'Medium Risk' : 'Low Risk'}
                </span>
              </div>
            `)
          )
          .addTo(map.current);

        markersRef.current.push(marker);
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
          .earthquake-popup .mapboxgl-popup-content {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .custom-popup .mapboxgl-popup-content {
            background: rgba(34, 197, 94, 0.9);
            color: white;
            border-radius: 8px;
            padding: 8px 12px;
          }
          .custom-popup .mapboxgl-popup-tip {
            border-top-color: rgba(34, 197, 94, 0.9);
          }
        `}
      </style>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
