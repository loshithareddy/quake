import { useState } from "react";
import { ChevronDown, Activity } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Earthquake } from "@/lib/types";
import SeismicGraph from "../SeismicGraph";

interface StateSeismicDataProps {
  earthquakes?: Earthquake[];
}

const indianStates = [
  { name: "Andhra Pradesh", riskLevel: "moderate" },
  { name: "Arunachal Pradesh", riskLevel: "high" },
  { name: "Assam", riskLevel: "high" },
  { name: "Bihar", riskLevel: "moderate" },
  { name: "Gujarat", riskLevel: "high" },
  { name: "Himachal Pradesh", riskLevel: "high" },
  { name: "Jammu and Kashmir", riskLevel: "high" },
  { name: "Maharashtra", riskLevel: "moderate" },
  { name: "Manipur", riskLevel: "high" },
  { name: "Meghalaya", riskLevel: "high" },
  { name: "Mizoram", riskLevel: "high" },
  { name: "Nagaland", riskLevel: "high" },
  { name: "Punjab", riskLevel: "moderate" },
  { name: "Sikkim", riskLevel: "high" },
  { name: "Uttarakhand", riskLevel: "high" },
  { name: "Chhattisgarh", riskLevel: "low" },
  { name: "Haryana", riskLevel: "low" },
  { name: "Jharkhand", riskLevel: "low" },
  { name: "Karnataka", riskLevel: "low" },
  { name: "Kerala", riskLevel: "low" },
  { name: "Madhya Pradesh", riskLevel: "low" },
  { name: "Odisha", riskLevel: "low" },
  { name: "Rajasthan", riskLevel: "low" },
  { name: "Tamil Nadu", riskLevel: "low" },
  { name: "Telangana", riskLevel: "low" },
  { name: "Tripura", riskLevel: "moderate" },
  { name: "Uttar Pradesh", riskLevel: "low" },
  { name: "West Bengal", riskLevel: "low" },
  { name: "Delhi", riskLevel: "moderate" }
];

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case "high":
      return "bg-red-500/20 border-red-500/50 text-red-500";
    case "moderate":
      return "bg-orange-500/20 border-orange-500/50 text-orange-500";
    default:
      return "bg-green-500/20 border-green-500/50 text-green-500";
  }
};

export const StateSeismicData = ({ earthquakes }: StateSeismicDataProps) => {
  const [selectedState, setSelectedState] = useState("all");

  const getStateEarthquakes = (state: string) => {
    if (!earthquakes) return [];
    return earthquakes.filter(eq => 
      eq.place?.toLowerCase().includes(state.toLowerCase())
    );
  };

  const filteredEarthquakes = selectedState === "all" 
    ? earthquakes 
    : getStateEarthquakes(selectedState);

  return (
    <Collapsible className="seismic-card">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-forest hover:bg-forest/5">
        <span className="flex items-center">
          <Activity className="mr-2" />
          State-wise Seismic Activity
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="col-span-2 p-2 bg-white/80 border border-forest/20 rounded-lg text-forest hover:border-forest/50 transition-colors"
          >
            <option value="all">All States</option>
            {indianStates.map(state => (
              <option key={state.name} value={state.name}>{state.name}</option>
            ))}
          </select>
        </div>

        <SeismicGraph earthquakes={filteredEarthquakes} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indianStates.map(state => {
            const stateEarthquakes = getStateEarthquakes(state.name);
            const riskClass = `risk-${state.riskLevel}`;
            
            return (
              <div 
                key={state.name} 
                className={`seismic-card ${riskClass} transition-all hover:scale-105`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-forest">{state.name}</h3>
                  <span className="text-sm capitalize text-forest/80">{state.riskLevel} Risk</span>
                </div>
                <div className="text-sm">
                  {stateEarthquakes.length > 0 ? (
                    <div className="space-y-2">
                      {stateEarthquakes.slice(0, 3).map(eq => (
                        <div key={eq.id} className="bg-white/50 p-2 rounded">
                          <div className="flex justify-between text-forest">
                            <span>M {eq.magnitude}</span>
                            <span>{new Date(eq.time).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs mt-1 text-forest/80">{eq.place}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-2 text-forest/70">No recent activity</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
