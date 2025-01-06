import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";

const Index = () => {
  const { toast } = useToast();
  const { data: earthquakes, error } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch earthquake data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="flex h-screen bg-forest">
      <Sidebar earthquakes={earthquakes} />
      <main className="flex-1 p-4">
        <Map earthquakes={earthquakes} />
      </main>
    </div>
  );
};

export default Index;