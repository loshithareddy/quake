
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
      return "bg-red-100 border-red-300 text-red-700";
    case "moderate":
      return "bg-orange-100 border-orange-300 text-orange-700";
    default:
      return "bg-green-100 border-green-300 text-green-700";
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
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-gray-800 hover:bg-gray-50">
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
            className="col-span-2 p-2 bg-white border border-gray-300 rounded-lg text-gray-800 hover:border-gray-400 transition-colors"
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
            const riskClass = getRiskColor(state.riskLevel);
            
            return (
              <div 
                key={state.name} 
                className={`bg-white rounded-lg p-4 shadow-sm ${riskClass}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{state.name}</h3>
                  <span className="text-sm capitalize">{state.riskLevel} Risk</span>
                </div>
                <div className="text-sm">
                  {stateEarthquakes.length > 0 ? (
                    <div className="space-y-2">
                      {stateEarthquakes.slice(0, 3).map(eq => (
                        <div key={eq.id} className="bg-white/80 p-2 rounded border border-current/20">
                          <div className="flex justify-between">
                            <span>M {eq.magnitude}</span>
                            <span>{new Date(eq.time).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs mt-1 opacity-80">{eq.place}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-2 opacity-70">No recent activity</p>
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
