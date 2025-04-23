
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
    onSettled: () => setIsLoading(false),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch earthquake data for map",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Count earthquakes by risk level
  const highRiskCount = earthquakes?.filter(eq => eq.magnitude >= 7).length || 0;
  const mediumRiskCount = earthquakes?.filter(eq => eq.magnitude >= 5 && eq.magnitude < 7).length || 0;
  const lowRiskCount = earthquakes?.filter(eq => eq.magnitude < 5).length || 0;

  return (
    <div className="pt-16 h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2]">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-indigo-900 mb-4">Interactive Seismic Map</h1>
        
        {/* Risk level indicators */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
            <span className="h-3 w-3 rounded-full bg-[#ea384c] mr-2"></span>
            <span className="text-sm font-medium text-gray-700">High Risk ({highRiskCount})</span>
          </div>
          <div className="flex items-center bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
            <span className="h-3 w-3 rounded-full bg-[#F97316] mr-2"></span>
            <span className="text-sm font-medium text-gray-700">Medium Risk ({mediumRiskCount})</span>
          </div>
          <div className="flex items-center bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
            <span className="h-3 w-3 rounded-full bg-[#22c55e] mr-2"></span>
            <span className="text-sm font-medium text-gray-700">Low Risk ({lowRiskCount})</span>
          </div>
          <div className="flex items-center bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
            <span className="h-3 w-3 rounded-full bg-[#64FFDA] mr-2"></span>
            <span className="text-sm font-medium text-gray-700">Your Location</span>
          </div>
        </div>
        
        {/* Map status indicators */}
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <Info className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-700">Loading earthquake data...</p>
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
          <Map earthquakes={earthquakes} />
        </div>
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>Click on earthquake markers to view detailed information. Use mouse or touch to pan and zoom.</p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
