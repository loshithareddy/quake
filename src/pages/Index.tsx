
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import NewsFeed from "@/components/NewsFeed";
import HistoricalDataComparison from "@/components/HistoricalDataComparison";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";
import RecentEarthquakesList from "@/components/RecentEarthquakesList";
import { Bell, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const { data: earthquakes, error, refetch } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
    refetchInterval: 180000, // Refetch every 3 minutes (reduced from 5)
  });

  // Handle automatic refetching and update time
  useEffect(() => {
    const updateInterval = setInterval(() => {
      refetch();
      setLastUpdate(new Date());
    }, 180000); // 3 minutes (reduced from 5)
    
    return () => clearInterval(updateInterval);
  }, [refetch]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    refetch();
    setLastUpdate(new Date());
    toast({
      title: "Data refreshed",
      description: "Earthquake data has been updated to the latest information.",
    });
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch earthquake data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Find significant earthquakes (magnitude >= 4.5)
  const significantEarthquakes = earthquakes?.filter(eq => eq.magnitude >= 4.5) || [];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2] pt-16">
      <Sidebar earthquakes={earthquakes} />
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-forest mb-1">Earthquake Monitoring Dashboard</h1>
            <p className="text-sm text-gray-600 mb-2">
              Last updated: {lastUpdate.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Button 
              variant="outline" 
              onClick={handleManualRefresh}
              className="text-forest border-forest hover:bg-forest/10"
            >
              Refresh Data
            </Button>
            <Link to="/alerts">
              <Button className="bg-forest hover:bg-forest/90 text-white">
                <Bell className="mr-2 h-4 w-4" />
                Manage Alerts
              </Button>
            </Link>
          </div>
        </div>

        {significantEarthquakes.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Significant Seismic Activity Detected</h3>
              <p className="text-sm text-red-700">
                {significantEarthquakes.length} earthquake{significantEarthquakes.length > 1 ? 's' : ''} with magnitude ≥4.5 in the last 24 hours.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="col-span-1 lg:col-span-2">
            <Map earthquakes={earthquakes} />
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <RecentEarthquakesList earthquakes={earthquakes} />
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
