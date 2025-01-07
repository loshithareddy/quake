import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Earthquake } from "@/lib/types";

interface StateSeismicDataProps {
  earthquakes?: Earthquake[];
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi"
];

export const StateSeismicData = ({ earthquakes }: StateSeismicDataProps) => {
  const [selectedState, setSelectedState] = useState("all");

  const getStateEarthquakes = (state: string) => {
    if (!earthquakes) return [];
    return earthquakes.filter(eq => 
      eq.place?.toLowerCase().includes(state.toLowerCase())
    );
  };

  return (
    <Collapsible className="border border-mint/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
        <span className="flex items-center">
          State-wise Seismic Activity
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full p-2 mb-4 bg-forest border border-mint/20 rounded text-white"
        >
          <option value="all">All States</option>
          {indianStates.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        {selectedState === "all" ? (
          indianStates.map(state => {
            const stateEarthquakes = getStateEarthquakes(state);
            if (stateEarthquakes.length === 0) return null;
            
            return (
              <div key={state} className="mb-4">
                <h3 className="text-mint font-semibold mb-2">{state}</h3>
                {stateEarthquakes.map(eq => (
                  <div key={eq.id} className="p-3 mb-2 bg-forest rounded-lg border border-mint/20">
                    <div className="flex justify-between">
                      <span className="text-white/80">Magnitude {eq.magnitude}</span>
                      <span className="text-xs text-mint/60">
                        {new Date(eq.time).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">{eq.place}</p>
                    <div className="text-xs text-mint/60 mt-1">
                      Source: {eq.source || "USGS"}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <div>
            {getStateEarthquakes(selectedState).map(eq => (
              <div key={eq.id} className="p-3 mb-2 bg-forest rounded-lg border border-mint/20">
                <div className="flex justify-between">
                  <span className="text-white/80">Magnitude {eq.magnitude}</span>
                  <span className="text-xs text-mint/60">
                    {new Date(eq.time).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/80 text-sm">{eq.place}</p>
                <div className="text-xs text-mint/60 mt-1">
                  Source: {eq.source || "USGS"}
                </div>
              </div>
            ))}
            {getStateEarthquakes(selectedState).length === 0 && (
              <p className="text-center text-white/60 py-4">
                No recent seismic activity recorded in {selectedState}
              </p>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};