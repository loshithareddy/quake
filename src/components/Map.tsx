
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import type { Earthquake } from "@/lib/types";
import { MapPin, CurrentLocation } from "lucide-react";

interface MapProps {
  earthquakes?: Earthquake[];
}

// Use same token as before
const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFydGgxMjMiLCJhIjoiY201bGtwNWk5MW9jNDJpc2Rzazd3bDRzNCJ9.w4fTRntk2IsCm1B_hjfb1g";

const getMarkerColor = (magnitude: number): string => {
  if (magnitude >= 7) return "#ea384c"; // High risk - Red
  if (magnitude >= 5) return "#F97316"; // Medium risk - Orange
  return "#22c55e"; // Low risk - Green
};

// Add diverse global mock quakes (3+ per continent, various risks/colors)
const globalMockEarthquakes: Earthquake[] = [
  // Asia
  { id: "asia-1", magnitude: 7.3, place: "Japan", time: Date.now() - 1000 * 60 * 60 * 8, latitude: 35.6895, longitude: 139.6917, depth: 30, source: "JMA" },
  { id: "asia-2", magnitude: 5.9, place: "Nepal", time: Date.now() - 1000 * 60 * 60 * 10, latitude: 27.7172, longitude: 85.3240, depth: 18, source: "IMD" },
  { id: "asia-3", magnitude: 4.3, place: "Pakistan", time: Date.now() - 1000 * 60 * 60 * 12, latitude: 30.3753, longitude: 69.3451, depth: 25, source: "USGS" },
  // Europe
  { id: "europe-1", magnitude: 6.8, place: "Greece", time: Date.now() - 1000 * 60 * 60 * 7, latitude: 39.0742, longitude: 21.8243, depth: 35, source: "EMSC" },
  { id: "europe-2", magnitude: 5.3, place: "Italy", time: Date.now() - 1000 * 60 * 60 * 14, latitude: 41.8719, longitude: 12.5674, depth: 12, source: "EMSC" },
  { id: "europe-3", magnitude: 3.7, place: "Turkey", time: Date.now() - 1000 * 60 * 60 * 20, latitude: 39.9334, longitude: 32.8597, depth: 10, source: "KOERI" },
  // Africa
  { id: "africa-1", magnitude: 6.4, place: "Morocco", time: Date.now() - 1000 * 60 * 60 * 6, latitude: 31.7917, longitude: -7.0926, depth: 20, source: "EMSC" },
  { id: "africa-2", magnitude: 5.6, place: "South Africa", time: Date.now() - 1000 * 60 * 60 * 13, latitude: -30.5595, longitude: 22.9375, depth: 28, source: "USGS" },
  { id: "africa-3", magnitude: 4.2, place: "Egypt", time: Date.now() - 1000 * 60 * 60 * 19, latitude: 26.8206, longitude: 30.8025, depth: 10, source: "EMSC" },
  // North America
  { id: "na-1", magnitude: 7.8, place: "Alaska, USA", time: Date.now() - 1000 * 60 * 60 * 3, latitude: 64.2008, longitude: -149.4937, depth: 40, source: "USGS" },
  { id: "na-2", magnitude: 6.2, place: "California, USA", time: Date.now() - 1000 * 60 * 60 * 11, latitude: 36.7783, longitude: -119.4179, depth: 17, source: "USGS" },
  { id: "na-3", magnitude: 4.4, place: "Mexico", time: Date.now() - 1000 * 60 * 60 * 14, latitude: 23.6345, longitude: -102.5528, depth: 15, source: "USGS" },
  // South America
  { id: "sa-1", magnitude: 8.2, place: "Chile", time: Date.now() - 1000 * 60 * 60 * 5, latitude: -35.6751, longitude: -71.5430, depth: 70, source: "USGS" },
  { id: "sa-2", magnitude: 6.5, place: "Peru", time: Date.now() - 1000 * 60 * 60 * 16, latitude: -9.1900, longitude: -75.0152, depth: 30, source: "USGS" },
  { id: "sa-3", magnitude: 3.8, place: "Argentina", time: Date.now() - 1000 * 60 * 60 * 18, latitude: -38.4161, longitude: -63.6167, depth: 20, source: "EMSC" },
  // Australia/Oceania
  { id: "au-1", magnitude: 7.1, place: "Papua New Guinea", time: Date.now() - 1000 * 60 * 60 * 9, latitude: -6.314993, longitude: 143.95555, depth: 22, source: "GEOFON" },
  { id: "au-2", magnitude: 5.7, place: "New Zealand", time: Date.now() - 1000 * 60 * 60 * 15, latitude: -40.9006, longitude: 174.8860, depth: 25, source: "GNS" },
  { id: "au-3", magnitude: 4.0, place: "Australia", time: Date.now() - 1000 * 60 * 60 * 21, latitude: -25.2744, longitude: 133.7751, depth: 16, source: "GA" },
  // Antarctica (dummy location, rare!)
  { id: "ant-1", magnitude: 6.0, place: "Antarctica", time: Date.now() - 1000 * 60 * 60 * 23, latitude: -82.8628, longitude: 135.0000, depth: 12, source: "IRIS" },
  { id: "ant-2", magnitude: 4.9, place: "West Antarctica", time: Date.now() - 1000 * 60 * 60 * 25, latitude: -75.2509, longitude: -0.0713, depth: 8, source: "IRIS" },
  { id: "ant-3", magnitude: 3.5, place: "East Antarctica", time: Date.now() - 1000 * 60 * 60 * 27, latitude: -66.9439, longitude: 99.9519, depth: 15, source: "IRIS" },
];

// MapPin SVG icon for use on map as marker
const LucideMapPin = ({ color, size = 36 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display: 'block'}} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 19 13.9 19 9.5C19 6.46243 16.5376 4 13.5 4C10.4624 4 8 6.46243 8 9.5C8 13.9 12 21 12 21Z"
      fill={color}
      stroke="#FFF"
      strokeWidth="1.8"
      />
    <circle cx="12" cy="10" r="3" fill="#fff" fillOpacity="0.8"/>
    <circle cx="12" cy="10" r="1.6" fill={color} />
  </svg>
);

const LucideCurrentLocation = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display: 'block'}} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#64FFDA" fillOpacity="0.95" stroke="#156971" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4" fill="#fff" fillOpacity="0.75"/>
    <circle cx="12" cy="12" r="1.8" fill="#156971"/>
  </svg>
);

const Map = ({ earthquakes = [] }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { toast } = useToast();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Mix earthquakes prop + global mock earthquakes for demo unless real data given
  const markersData: Earthquake[] = Array.isArray(earthquakes) && earthquakes.length > 0
    ? earthquakes
    : globalMockEarthquakes;

  useEffect(() => {
    if (!mapContainer.current) return;
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [15, 20], // world-centric
        zoom: 1.4,
        minZoom: 1.2,
        pitch: 30,
      });

      map.current.on('load', () => {
        setIsMapInitialized(true);
        map.current?.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.current?.addControl(new mapboxgl.FullscreenControl(), "top-right");
        map.current?.addControl(new mapboxgl.ScaleControl(), "bottom-left");
        map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.35 });
        map.current?.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        // Find and add user geolocation (cyan icon)
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation([longitude, latitude]);
              // User marker with custom SVG
              const userElement = document.createElement('div');
              userElement.className = 'user-location-pin';
              userElement.innerHTML = `<div style="width:32px;height:32px;">${LucideCurrentLocation({size:32}).props.children.map(c=>c.props && c.props.d?`<svg width="32" height="32">${c.props.d?`<path d="${c.props.d}" fill="${c.props.fill}" stroke="${c.props.stroke}" stroke-width="${c.props.strokeWidth}" fill-opacity="${c.props.fillOpacity??""}"></path>`:""}</svg>`:"")}</div>`;
              // fallback fallback
              userElement.innerHTML = `<div class="inline-block">${LucideCurrentLocation().props.children.map((v, idx) => {
                // All children are SVG shapes
                if (v.type === "circle") {
                  const p = v.props;
                  return `<svg width="36" height="36"><circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.fill}" ${p.fillOpacity ? `fill-opacity="${p.fillOpacity}"` : ""} ${p.stroke ? `stroke="${p.stroke}"` : ""} ${p.strokeWidth ? `stroke-width="${p.strokeWidth}"` : ""}/></svg>`;
                }
                return "";
              }).join("")}</div>`;
              new mapboxgl.Marker({
                element: userElement,
              })
                .setLngLat([longitude, latitude])
                .setPopup(new mapboxgl.Popup({
                  closeButton: false,
                  className: 'custom-popup'
                }).setHTML("<h3>Your Location</h3>"))
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
    if (!map.current || !Array.isArray(markersData) || !isMapInitialized) return;
    try {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      markersData.forEach((eq) => {
        if (typeof eq.latitude !== "number" || typeof eq.longitude !== "number") return;
        // Icon = MapPin SVG colored by risk
        const el = document.createElement('div');
        el.className = 'earthquake-marker-pin flex items-center justify-center';
        el.style.width = '36px';
        el.style.height = '36px';
        el.innerHTML = `<div>${LucideMapPin({ color: getMarkerColor(eq.magnitude), size: 36 }).props.children.map((v, idx) => {
          if (v.type === "path") {
            // path with d, fill, stroke, strokeWidth
            const p = v.props;
            return `<svg width="36" height="36"><path d="${p.d}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}"></path></svg>`;
          } else if (v.type === "circle") {
            const p = v.props;
            return `<svg width="36" height="36"><circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.fill}" ${p.fillOpacity ? `fill-opacity="${p.fillOpacity}"` : ""}/></svg>`;
          }
          return "";
        }).join("")}</div>`;
        // Animate marker drop-in
        el.style.transition = 'transform 0.18s cubic-bezier(0.47,1.64,0.41,0.8)';
        el.style.transform = 'scale(1)';
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.18)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });
        // Popup on marker
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
                <span class="inline-block px-3 py-1 mt-2 rounded-full text-sm font-semibold"
                  style="background-color: ${
                    eq.magnitude >= 7
                      ? '#fde8e9'
                      : eq.magnitude >= 5
                      ? '#ffe9d3'
                      : '#e8fbe9'
                  }; color: ${
                    eq.magnitude >= 7
                      ? '#ea384c'
                      : eq.magnitude >= 5
                      ? '#F97316'
                      : '#22c55e'
                  };">
                  ${eq.magnitude >= 7 ? 'High Risk' : eq.magnitude >= 5 ? 'Medium Risk' : 'Low Risk'}
                </span>
              </div>
            `)
          )
          .addTo(map.current!);
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
  }, [markersData, isMapInitialized, toast]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-forest/20 seismic-card">
      <style>
        {`
          /* Animate pin as a drop-in */
          .earthquake-marker-pin {
            cursor: pointer;
            transition: transform 0.18s cubic-bezier(0.47,1.64,0.41,0.8);
          }
          .earthquake-marker-pin:hover {
            transform: scale(1.18);
            z-index: 11;
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
            background: rgba(100, 255, 218, 0.92);
            color: rgb(22, 78, 99);
            font-weight: bold;
            border-radius: 8px;
            padding: 8px 12px;
          }
          .custom-popup .mapboxgl-popup-tip {
            border-top-color: rgba(100, 255, 218, 0.9);
          }
        `}
      </style>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;

