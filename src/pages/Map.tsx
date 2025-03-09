
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";
import Map from "@/components/Map";

const MapPage = () => {
  const { toast } = useToast();
  const { data: earthquakes, error } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
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

  return (
    <div className="pt-16 h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2]">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Interactive Seismic Map</h1>
        <div className="h-[calc(100vh-200px)] bg-white/80 rounded-xl shadow-lg p-4">
          <Map earthquakes={earthquakes} />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
