
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import NewsFeed from "@/components/NewsFeed";
import HistoricalDataComparison from "@/components/HistoricalDataComparison";
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
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2] pt-16">
      <Sidebar earthquakes={earthquakes} />
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="col-span-1 lg:col-span-2">
            <Map earthquakes={earthquakes} />
          </div>
          <div>
            <NewsFeed />
          </div>
          <div>
            <HistoricalDataComparison />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
