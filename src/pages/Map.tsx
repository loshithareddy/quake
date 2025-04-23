
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";
import Map from "@/components/Map";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const MapPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: earthquakes, error } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
  });

  // Update loading state based on query status
  useEffect(() => {
    if (error || earthquakes) {
      setIsLoading(false);
    }
  }, [error, earthquakes]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch earthquake data for map",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Add mock data for testing if no real data is available
  const mockEarthquakes = [
    {
      id: "mock-1",
      magnitude: 7.2,
      place: "Hindu Kush region, Afghanistan",
      time: Date.now() - 1000 * 60 * 60 * 2,
      latitude: 36.52,
      longitude: 71.13,
      depth: 212,
      source: "USGS"
    },
    {
      id: "mock-2",
      magnitude: 6.1,
      place: "Andaman Islands, India",
      time: Date.now() - 1000 * 60 * 60 * 5,
      latitude: 11.75,
      longitude: 92.76,
      depth: 10,
      source: "IMD"
    },
    {
      id: "mock-3",
      magnitude: 5.4,
      place: "Kashmir-Xinjiang Border Region",
      time: Date.now() - 1000 * 60 * 60 * 8,
      latitude: 35.4,
      longitude: 77.8,
      depth: 35,
      source: "EMSC"
    },
    {
      id: "mock-4",
      magnitude: 4.8,
      place: "Nicobar Islands, India",
      time: Date.now() - 1000 * 60 * 60 * 12,
      latitude: 8.9,
      longitude: 93.8,
      depth: 28,
      source: "IMD"
    },
    {
      id: "mock-5",
      magnitude: 3.5,
      place: "Gujarat, India",
      time: Date.now() - 1000 * 60 * 60 * 16,
      latitude: 23.2,
      longitude: 70.4,
      depth: 15,
      source: "IMD"
    }
  ];

  // Use mock data if no real data is available
  const displayEarthquakes = earthquakes && earthquakes.length > 0 ? earthquakes : mockEarthquakes;

  // Count earthquakes by risk level using the displayed earthquakes
  const highRiskCount = displayEarthquakes.filter(eq => eq.magnitude >= 7).length || 0;
  const mediumRiskCount = displayEarthquakes.filter(eq => eq.magnitude >= 5 && eq.magnitude < 7).length || 0;
  const lowRiskCount = displayEarthquakes.filter(eq => eq.magnitude < 5).length || 0;

  return (
    <div className="pt-16 h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2]">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-indigo-900 mb-4">Interactive Seismic Map</h1>
        
        {/* Risk level indicators */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
  <div className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-xl shadow-md">
    <AlertTriangle className="w-5 h-5" />
    <span>High Risk ({highRiskCount})</span>
  </div>
  <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-4 py-2 rounded-xl shadow-md">
    <AlertTriangle className="w-5 h-5" />
    <span>Medium Risk ({mediumRiskCount})</span>
  </div>
  <div className="flex items-center space-x-3 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow-md">
    <AlertTriangle className="w-5 h-5" />
    <span>Low Risk ({lowRiskCount})</span>
  </div>
  <div className="flex items-center space-x-3 bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-4 py-2 rounded-xl shadow-md">
    <Info className="w-5 h-5" />
    <span>Your Location</span>
  </div>
</div>

        )}
        
        {!isLoading && error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700">Failed to load earthquake data. Please try again later.</p>
            </div>
          </div>
        )}
        
        {!isLoading && !error && highRiskCount > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">High Risk Areas Detected</h3>
              <p className="text-sm text-red-700">
                {highRiskCount} location{highRiskCount > 1 ? 's' : ''} with magnitude ≥7.0 in the last 24 hours.
              </p>
            </div>
          </div>
        )}
        
        <div className="h-[calc(100vh-280px)] bg-white/80 rounded-xl shadow-lg p-4">
          <Map earthquakes={displayEarthquakes} />
        </div>
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>Click on earthquake markers to view detailed information. Use mouse or touch to pan and zoom.</p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
