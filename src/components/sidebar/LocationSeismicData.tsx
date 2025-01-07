import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Earthquake } from "@/lib/types";
import { format } from "date-fns";
import SeismicGraph from "../SeismicGraph";

interface LocationSeismicDataProps {
  earthquakes?: Earthquake[];
}

export const LocationSeismicData = ({ earthquakes }: LocationSeismicDataProps) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  
  const sources = ["all", "IMD", "NCS", "USGS", "EMSC", "IRIS"];
  
  const filteredEarthquakes = earthquakes?.filter(eq => {
    const locationMatch = eq.place?.toLowerCase().includes(selectedLocation.toLowerCase());
    const sourceMatch = selectedSource === "all" || eq.source === selectedSource;
    return locationMatch && sourceMatch;
  });

  return (
    <Collapsible className="border border-mint/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
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
            className="w-full p-2 bg-transparent border border-mint/20 rounded text-white"
          />
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full p-2 bg-forest border border-mint/20 rounded text-white"
          >
            {sources.map(source => (
              <option key={source} value={source}>
                {source === "all" ? "All Sources" : source}
              </option>
            ))}
          </select>
        </div>
        
        <SeismicGraph earthquakes={filteredEarthquakes} />
        
        {filteredEarthquakes && filteredEarthquakes.length > 0 ? (
          filteredEarthquakes.map((eq) => (
            <div key={eq.id} className="p-3 rounded-lg bg-forest border border-mint/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-mint">
                  Magnitude {eq.magnitude}
                </span>
                <span className="text-sm text-white/60">
                  {format(new Date(eq.time), "PPp")}
                </span>
              </div>
              <p className="text-white/80 mb-1">{eq.place}</p>
              <div className="flex justify-between">
                <p className="text-sm text-white/60">Depth: {eq.depth}km</p>
                <span className="text-xs text-mint/60">Source: {eq.source || "USGS"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-white/60">
            No recent seismic activity recorded for this location.
            <br />
            <span className="text-sm">
              The graph above shows historical seismic patterns for reference.
            </span>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};