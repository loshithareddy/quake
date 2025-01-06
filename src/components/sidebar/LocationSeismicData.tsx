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
  
  const filteredEarthquakes = earthquakes?.filter(eq => 
    eq.place?.toLowerCase().includes(selectedLocation.toLowerCase())
  );

  return (
    <Collapsible className="border border-mint/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
        <span className="flex items-center">
          <AlertTriangle className="mr-2" />
          Recent Earthquakes & Activity
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 space-y-3">
        <input
          type="text"
          placeholder="Enter location to filter data..."
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full p-2 mb-4 bg-transparent border border-mint/20 rounded text-white"
        />
        
        <SeismicGraph earthquakes={filteredEarthquakes} />
        
        {filteredEarthquakes?.map((eq) => (
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
            <p className="text-sm text-white/60">Depth: {eq.depth}km</p>
          </div>
        ))}
        
        {selectedLocation && filteredEarthquakes?.length === 0 && (
          <div className="text-center p-4 text-white/60">
            No earthquake data found for this location
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};