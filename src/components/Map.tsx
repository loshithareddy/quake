
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import type { Earthquake } from "@/lib/types";
import { MapPin, Locate } from "lucide-react";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFydGgxMjMiLCJhIjoiY201bGtwNWk5MW9jNDJpc2Rzazd3bDRzNCJ9.w4fTRntk2IsCm1B_hjfb1g";

const getMarkerColor = (magnitude: number): string => {
  if (magnitude >= 7) return "#ea384c"; // High risk - Red
  if (magnitude >= 5) return "#F97316"; // Medium risk - Orange
  return "#22c55e"; // Low risk - Green
};

// Expanded global mock earthquakes with at least 3 per continent and 25+ total
const globalMockEarthquakes: Earthquake[] = [
  // Asia (6)
  { id: "asia-1", magnitude: 7.3, place: "Tokyo, Japan 🗾", time: Date.now() - 1000 * 60 * 60 * 8, latitude: 35.6895, longitude: 139.6917, depth: 30, source: "JMA" },
  { id: "asia-2", magnitude: 5.9, place: "Kathmandu, Nepal 🏔️", time: Date.now() - 1000 * 60 * 60 * 10, latitude: 27.7172, longitude: 85.3240, depth: 18, source: "IMD" },
  { id: "asia-3", magnitude: 4.3, place: "Islamabad, Pakistan 🇵🇰", time: Date.now() - 1000 * 60 * 60 * 12, latitude: 33.6844, longitude: 73.0479, depth: 25, source: "USGS" },
  { id: "asia-4", magnitude: 6.5, place: "Manila, Philippines 🏝️", time: Date.now() - 1000 * 60 * 60 * 7, latitude: 14.5995, longitude: 120.9842, depth: 22, source: "PHIVOLCS" },
  { id: "asia-5", magnitude: 5.2, place: "Taipei, Taiwan 🇹🇼", time: Date.now() - 1000 * 60 * 60 * 9, latitude: 25.0330, longitude: 121.5654, depth: 15, source: "CWB" },
  { id: "asia-6", magnitude: 4.8, place: "Bangkok, Thailand 🇹🇭", time: Date.now() - 1000 * 60 * 60 * 5, latitude: 13.7563, longitude: 100.5018, depth: 10, source: "USGS" },
  
  // Europe (5)
  { id: "europe-1", magnitude: 6.8, place: "Athens, Greece 🏺", time: Date.now() - 1000 * 60 * 60 * 7, latitude: 37.9838, longitude: 23.7275, depth: 35, source: "EMSC" },
  { id: "europe-2", magnitude: 5.3, place: "Rome, Italy 🍕", time: Date.now() - 1000 * 60 * 60 * 14, latitude: 41.9028, longitude: 12.4964, depth: 12, source: "EMSC" },
  { id: "europe-3", magnitude: 3.7, place: "Ankara, Turkey 🇹🇷", time: Date.now() - 1000 * 60 * 60 * 20, latitude: 39.9334, longitude: 32.8597, depth: 10, source: "KOERI" },
  { id: "europe-4", magnitude: 4.5, place: "Lisbon, Portugal 🇵🇹", time: Date.now() - 1000 * 60 * 60 * 15, latitude: 38.7223, longitude: -9.1393, depth: 14, source: "EMSC" },
  { id: "europe-5", magnitude: 5.1, place: "Madrid, Spain 🇪🇸", time: Date.now() - 1000 * 60 * 60 * 3, latitude: 40.4168, longitude: -3.7038, depth: 16, source: "IGN" },
  
  // Africa (4)
  { id: "africa-1", magnitude: 6.4, place: "Marrakesh, Morocco 🕌", time: Date.now() - 1000 * 60 * 60 * 6, latitude: 31.6295, longitude: -7.9811, depth: 20, source: "EMSC" },
  { id: "africa-2", magnitude: 5.6, place: "Cape Town, South Africa 🇿🇦", time: Date.now() - 1000 * 60 * 60 * 13, latitude: -33.9249, longitude: 18.4241, depth: 28, source: "CGS" },
  { id: "africa-3", magnitude: 4.2, place: "Cairo, Egypt 🏺", time: Date.now() - 1000 * 60 * 60 * 19, latitude: 30.0444, longitude: 31.2357, depth: 10, source: "ENSN" },
  { id: "africa-4", magnitude: 5.1, place: "Nairobi, Kenya 🦒", time: Date.now() - 1000 * 60 * 60 * 4, latitude: -1.2921, longitude: 36.8219, depth: 15, source: "USGS" },
  
  // North America (5)
  { id: "na-1", magnitude: 7.8, place: "Anchorage, Alaska 🗻", time: Date.now() - 1000 * 60 * 60 * 3, latitude: 61.2181, longitude: -149.9003, depth: 40, source: "USGS" },
  { id: "na-2", magnitude: 6.2, place: "San Francisco, California 🌉", time: Date.now() - 1000 * 60 * 60 * 11, latitude: 37.7749, longitude: -122.4194, depth: 17, source: "USGS" },
  { id: "na-3", magnitude: 4.4, place: "Mexico City, Mexico 🌮", time: Date.now() - 1000 * 60 * 60 * 14, latitude: 19.4326, longitude: -99.1332, depth: 15, source: "SSN" },
  { id: "na-4", magnitude: 5.7, place: "Vancouver, Canada 🍁", time: Date.now() - 1000 * 60 * 60 * 2, latitude: 49.2827, longitude: -123.1207, depth: 22, source: "USGS" },
  { id: "na-5", magnitude: 3.9, place: "Chicago, Illinois 🏙️", time: Date.now() - 1000 * 60 * 60 * 17, latitude: 41.8781, longitude: -87.6298, depth: 8, source: "USGS" },
  
  // South America (5)
  { id: "sa-1", magnitude: 8.2, place: "Santiago, Chile 🗻", time: Date.now() - 1000 * 60 * 60 * 5, latitude: -33.4489, longitude: -70.6693, depth: 70, source: "USGS" },
  { id: "sa-2", magnitude: 6.5, place: "Lima, Peru 🏔️", time: Date.now() - 1000 * 60 * 60 * 16, latitude: -12.0464, longitude: -77.0428, depth: 30, source: "IGP" },
  { id: "sa-3", magnitude: 5.2, place: "Buenos Aires, Argentina 🥩", time: Date.now() - 1000 * 60 * 60 * 18, latitude: -34.6037, longitude: -58.3816, depth: 20, source: "INPRES" },
  { id: "sa-4", magnitude: 4.8, place: "Bogotá, Colombia ☕", time: Date.now() - 1000 * 60 * 60 * 1, latitude: 4.7110, longitude: -74.0721, depth: 25, source: "SGC" },
  { id: "sa-5", magnitude: 3.8, place: "Caracas, Venezuela 🇻🇪", time: Date.now() - 1000 * 60 * 60 * 9, latitude: 10.4806, longitude: -66.9036, depth: 15, source: "FUNVISIS" },
  
  // Australia/Oceania (4)
  { id: "au-1", magnitude: 7.1, place: "Port Moresby, Papua New Guinea 🌴", time: Date.now() - 1000 * 60 * 60 * 9, latitude: -9.4438, longitude: 147.1803, depth: 22, source: "GEOFON" },
  { id: "au-2", magnitude: 5.7, place: "Wellington, New Zealand 🥝", time: Date.now() - 1000 * 60 * 60 * 15, latitude: -41.2865, longitude: 174.7762, depth: 25, source: "GNS" },
  { id: "au-3", magnitude: 4.0, place: "Sydney, Australia 🦘", time: Date.now() - 1000 * 60 * 60 * 21, latitude: -33.8688, longitude: 151.2093, depth: 16, source: "GA" },
  { id: "au-4", magnitude: 6.1, place: "Suva, Fiji 🏝️", time: Date.now() - 1000 * 60 * 60 * 13, latitude: -18.1416, longitude: 178.4419, depth: 35, source: "USGS" },
  
  // Antarctica (3)
  { id: "ant-1", magnitude: 6.0, place: "Ross Ice Shelf, Antarctica 🧊", time: Date.now() - 1000 * 60 * 60 * 23, latitude: -81.5000, longitude: 175.0000, depth: 12, source: "IRIS" },
  { id: "ant-2", magnitude: 4.9, place: "Queen Maud Land, Antarctica ❄️", time: Date.now() - 1000 * 60 * 60 * 25, latitude: -75.2509, longitude: 0.0713, depth: 8, source: "IRIS" },
  { id: "ant-3", magnitude: 3.5, place: "Antarctic Peninsula 🏔️", time: Date.now() - 1000 * 60 * 60 * 27, latitude: -66.9439, longitude: -60.5519, depth: 15, source: "IRIS" },
];

const createMapPin = ({ color, size = 36 }: { color: string; size?: number }) => {
  const element = document.createElement('div');
  element.className = 'earthquake-marker-pin';
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  
  // Create SVG for map pin
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'white');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  
  // Create map pin path (using Lucide MapPin shape)
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z');
  path.setAttribute('fill', color);
  path.setAttribute('stroke', 'white');
  path.setAttribute('stroke-width', '1.5');
  
  // Create circle for pin center
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '10');
  circle.setAttribute('r', '3');
  circle.setAttribute('fill', 'white');
  circle.setAttribute('fill-opacity', '0.9');
  
  svg.appendChild(path);
  svg.appendChild(circle);
  element.appendChild(svg);
  
  return element;
};

const createLocationPin = (size = 36) => {
  const element = document.createElement('div');
  element.className = 'user-location-pin';
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  
  // Create SVG for location pin
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  // Create map pin path (using Lucide LocateFixed shape)
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z');
  path.setAttribute('fill', '#64FFDA');
  path.setAttribute('stroke', '#156971');
  path.setAttribute('stroke-width', '2');
  
  // Create outer circle
  const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  outerCircle.setAttribute('cx', '12');
  outerCircle.setAttribute('cy', '10');
  outerCircle.setAttribute('r', '3');
  outerCircle.setAttribute('fill', 'white');
  outerCircle.setAttribute('fill-opacity', '0.9');
  outerCircle.setAttribute('stroke', '#156971');
  outerCircle.setAttribute('stroke-width', '1');
  
  // Create inner circle
  const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  innerCircle.setAttribute('cx', '12');
  innerCircle.setAttribute('cy', '10');
  innerCircle.setAttribute('r', '1.5');
  innerCircle.setAttribute('fill', '#156971');
  
  svg.appendChild(path);
  svg.appendChild(outerCircle);
  svg.appendChild(innerCircle);
  element.appendChild(svg);
  
  return element;
};

const Map = ({ earthquakes = [] }: { earthquakes?: Earthquake[] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { toast } = useToast();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Use provided earthquake data or fallback to our expanded global mock data
  const markersData = Array.isArray(earthquakes) && earthquakes.length > 0
    ? earthquakes
    : globalMockEarthquakes;

  useEffect(() => {
    if (!mapContainer.current) return;
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [15, 20],
        zoom: 1.4,
        minZoom: 1.2,
        pitch: 30,
        scrollZoom: {
          speed: 0.9,
          around: 'center'
        }
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
        
        // Prevent page scrolling when interacting with the map
        const mapDiv = mapContainer.current;
        if (mapDiv) {
          mapDiv.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
          }, { passive: false });
          
          // Add touch events for mobile
          mapDiv.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation();
          }, { passive: false });
        }
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation([longitude, latitude]);
              
              // Add user location marker with the cyan location pin
              if (map.current) {
                new mapboxgl.Marker({
                  element: createLocationPin(),
                  anchor: 'bottom' // Ensure marker stays in position
                })
                  .setLngLat([longitude, latitude])
                  .setPopup(
                    new mapboxgl.Popup({
                      closeButton: false,
                      className: 'custom-popup',
                      offset: [0, -10] // Add offset for better positioning
                    }).setHTML("<h3>📍 Your Current Location</h3>")
                  )
                  .addTo(map.current);
              }
              
              toast({
                title: "Location found",
                description: "Your location has been added to the map 📍",
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
        if (map.current) {
          map.current.remove();
          setIsMapInitialized(false);
        }
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
    if (!map.current || !isMapInitialized) return;
    
    try {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add markers for each earthquake
      markersData.forEach((eq) => {
        if (typeof eq.latitude !== "number" || typeof eq.longitude !== "number") return;
        
        // Create map pin marker with appropriate color based on magnitude
        const markerElement = createMapPin({ 
          color: getMarkerColor(eq.magnitude),
          size: Math.min(36 + eq.magnitude * 2, 50) // Size slightly varies with magnitude
        });
        
        // Add hover effects
        markerElement.style.transition = 'transform 0.18s cubic-bezier(0.47,1.64,0.41,0.8)';
        markerElement.style.transform = 'scale(1)';
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.18)';
        });
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
        });

        // Create and add the marker with popup
        const marker = new mapboxgl.Marker({ 
          element: markerElement,
          anchor: 'bottom', // Anchor to bottom to prevent shifting
          offset: [0, 0] // No offset needed with bottom anchor
        })
          .setLngLat([eq.longitude, eq.latitude])
          .setPopup(
            new mapboxgl.Popup({
              closeButton: true,
              maxWidth: "320px",
              className: 'earthquake-popup',
              closeOnClick: false,
              offset: [0, -5], // Slight offset for better positioning
              anchor: 'bottom' // Anchor popup to bottom of marker
            }).setHTML(`
              <div class="p-3 rounded-lg">
                <h3 class="font-bold text-lg mb-1 text-gray-900">🌋 Magnitude ${eq.magnitude.toFixed(1)}</h3>
                <p class="text-gray-700 mb-1"><span class="font-semibold">📏 Depth:</span> ${eq.depth}km</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">📍 Location:</span> ${eq.place}</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">⏰ Time:</span> ${new Date(eq.time).toLocaleString()}</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">📡 Source:</span> ${eq.source || 'Unknown'}</p>
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
                  ${eq.magnitude >= 7 ? '⚠️ High Risk' : eq.magnitude >= 5 ? '⚡ Medium Risk' : '✅ Low Risk'}
                </span>
              </div>
            `)
          )
          .addTo(map.current!);
          
        // Store marker reference for cleanup
        markersRef.current.push(marker);
      });
      
      // Log the number of markers added
      console.log(`Added ${markersRef.current.length} earthquake markers to the map`);
      
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
          .earthquake-marker-pin {
            cursor: pointer;
            transition: transform 0.18s cubic-bezier(0.47,1.64,0.41,0.8);
            z-index: 2;
            transform-origin: center bottom; /* Fix pin at bottom point */
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
            position: relative;
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
          .mapboxgl-map {
            overflow: hidden;
          }
          .mapboxgl-popup {
            transform-origin: bottom center;
            max-width: 350px !important;
            max-height: 400px !important;
            z-index: 10;
          }
          .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
          .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
          .mapboxgl-popup-anchor-center .mapboxgl-popup-tip,
          .mapboxgl-popup-anchor-left .mapboxgl-popup-tip,
          .mapboxgl-popup-anchor-right .mapboxgl-popup-tip,
          .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
          .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip,
          .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip,
          .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
            display: block;
          }
          /* Ensure markers don't move when clicking */
          .mapboxgl-marker {
            will-change: transform;
            transform-origin: bottom center !important;
          }
        `}
      </style>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
