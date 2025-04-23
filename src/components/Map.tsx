
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

      // Log to see if we have earthquakes data
      console.log(`Adding ${earthquakes.length} earthquake markers to map`);

      earthquakes.forEach((eq) => {
        // Determine marker color based on magnitude
        const color = getMarkerColor(eq.magnitude);
        
        // Size based on magnitude
        const size = eq.magnitude >= 7 ? 26 : eq.magnitude >= 5 ? 22 : 18;
        
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'earthquake-marker';
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = color;
        el.style.border = `2px solid white`;
        el.style.boxShadow = `0 0 0 2px ${color}88, 0 0 10px rgba(0,0,0,0.5)`;
        
        // Add pulse animation based on risk level
        if (eq.magnitude >= 7) {
          el.style.animation = 'pulse-high 1.5s infinite';
        } else if (eq.magnitude >= 5) {
          el.style.animation = 'pulse-medium 2s infinite';
        } else {
          el.style.animation = 'pulse-low 3s infinite';
        }

        // Create and add the marker
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([eq.longitude, eq.latitude])
          .setPopup(
            new mapboxgl.Popup({
              closeButton: true,
              maxWidth: "320px",
              className: 'earthquake-popup'
            }).setHTML(`
              <div class="p-3 rounded-lg">
                <h3 class="font-bold text-lg mb-1 text-gray-900">Magnitude ${eq.magnitude.toFixed(1)}</h3>
                <p class="text-gray-700 mb-1"><span class="font-semibold">Depth:</span> ${eq.depth}km</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">Location:</span> ${eq.place}</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">Time:</span> ${new Date(eq.time).toLocaleString()}</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">Source:</span> ${eq.source || 'Unknown'}</p>
                <span class="inline-block px-3 py-1 mt-2 rounded-full text-sm font-semibold ${
                  eq.magnitude >= 7
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
          @keyframes pulse-high {
            0% {
              box-shadow: 0 0 0 0 rgba(234, 56, 76, 0.7), 0 0 0 0 rgba(234, 56, 76, 0.4);
            }
            50% {
              box-shadow: 0 0 0 10px rgba(234, 56, 76, 0), 0 0 0 5px rgba(234, 56, 76, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(234, 56, 76, 0), 0 0 0 0 rgba(234, 56, 76, 0);
            }
          }
          
          @keyframes pulse-medium {
            0% {
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7), 0 0 0 0 rgba(249, 115, 22, 0.4);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(249, 115, 22, 0), 0 0 0 4px rgba(249, 115, 22, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0), 0 0 0 0 rgba(249, 115, 22, 0);
            }
          }
          
          @keyframes pulse-low {
            0% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7), 0 0 0 0 rgba(34, 197, 94, 0.4);
            }
            50% {
              box-shadow: 0 0 0 6px rgba(34, 197, 94, 0), 0 0 0 3px rgba(34, 197, 94, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0), 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }
          
          .earthquake-popup .mapboxgl-popup-content {
            border-radius: 10px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            padding: 8px;
          }
          
          .earthquake-popup .mapboxgl-popup-tip {
            border-top-color: white;
          }
          
          .custom-popup .mapboxgl-popup-content {
            background: rgba(100, 255, 218, 0.9);
            color: rgb(22, 78, 99);
            font-weight: bold;
            border-radius: 8px;
            padding: 8px 12px;
          }
          
          .custom-popup .mapboxgl-popup-tip {
            border-top-color: rgba(100, 255, 218, 0.9);
          }
          
          .earthquake-marker {
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          
          .earthquake-marker:hover {
            transform: scale(1.2);
            z-index: 10;
          }
        `}
      </style>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
