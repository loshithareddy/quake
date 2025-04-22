
import { useState, useEffect } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Earthquake } from "@/lib/types";
import { format } from "date-fns";
import SeismicGraph from "../SeismicGraph";
import { useToast } from "@/hooks/use-toast";

interface LocationSeismicDataProps {
  earthquakes?: Earthquake[];
}

export const LocationSeismicData = ({ earthquakes }: LocationSeismicDataProps) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [lastMagnitude, setLastMagnitude] = useState<number | null>(null);
  const { toast } = useToast();
  
  const sources = ["all", "IMD", "NCS", "USGS", "EMSC", "IRIS"];
  
  const filteredEarthquakes = earthquakes?.filter(eq => {
    const locationMatch = selectedLocation === "" || eq.place?.toLowerCase().includes(selectedLocation.toLowerCase());
    const sourceMatch = selectedSource === "all" || eq.source === selectedSource;
    return locationMatch && sourceMatch;
  });

  useEffect(() => {
    if (!earthquakes || earthquakes.length === 0) return;

    const latestEarthquake = earthquakes[0];
    
    if (lastMagnitude === null) {
      setLastMagnitude(latestEarthquake.magnitude);
      return;
    }

    if (latestEarthquake.magnitude > lastMagnitude) {
      // Alert for significant increase in magnitude
      toast({
        title: "⚠️ Seismic Activity Alert",
        description: `Increased seismic activity detected: Magnitude ${latestEarthquake.magnitude} at ${latestEarthquake.place}`,
        variant: latestEarthquake.magnitude >= 5 ? "destructive" : "default",
      });
    }

    setLastMagnitude(latestEarthquake.magnitude);
  }, [earthquakes, lastMagnitude, toast]);

  return (
    <Collapsible className="seismic-card">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-gray-800 hover:bg-gray-50">
        <span className="flex items-center">
          <AlertTriangle className="mr-2" />
          Seismic Activity in India
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 space-y-3">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter location to filter data..."
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800"
          />
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800"
          >
            {sources.map(source => (
              <option key={source} value={source}>
                {source === "all" ? "All Sources" : source}
              </option>
            ))}
          </select>
        </div>
        
        <SeismicGraph earthquakes={filteredEarthquakes} />
        
        {filteredEarthquakes && filteredEarthquakes.length > 0 && (
          filteredEarthquakes.map((eq) => (
            <div key={eq.id} className="p-3 rounded-lg bg-white border border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${eq.magnitude >= 5 ? 'text-red-500' : 'text-gray-800'}`}>
                  Magnitude {eq.magnitude}
                </span>
                <span className="text-sm text-gray-600">
                  {format(new Date(eq.time), "PPp")}
                </span>
              </div>
              <p className="text-gray-800 mb-1">{eq.place}</p>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Depth: {eq.depth}km</p>
                <span className="text-xs text-gray-500">Source: {eq.source || "USGS"}</span>
              </div>
            </div>
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
