
import { useState } from "react";
import { ChevronDown, Activity } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Earthquake } from "@/lib/types";

// Complete list of Indian states and union territories with risk levels.
const indianStates = [
  { name: "Andhra Pradesh", riskLevel: "moderate" },
  { name: "Arunachal Pradesh", riskLevel: "high" },
  { name: "Assam", riskLevel: "high" },
  { name: "Bihar", riskLevel: "moderate" },
  { name: "Chhattisgarh", riskLevel: "low" },
  { name: "Goa", riskLevel: "low" },
  { name: "Gujarat", riskLevel: "high" },
  { name: "Haryana", riskLevel: "low" },
  { name: "Himachal Pradesh", riskLevel: "high" },
  { name: "Jharkhand", riskLevel: "low" },
  { name: "Karnataka", riskLevel: "low" },
  { name: "Kerala", riskLevel: "low" },
  { name: "Madhya Pradesh", riskLevel: "low" },
  { name: "Maharashtra", riskLevel: "moderate" },
  { name: "Manipur", riskLevel: "high" },
  { name: "Meghalaya", riskLevel: "high" },
  { name: "Mizoram", riskLevel: "high" },
  { name: "Nagaland", riskLevel: "high" },
  { name: "Odisha", riskLevel: "low" },
  { name: "Punjab", riskLevel: "moderate" },
  { name: "Rajasthan", riskLevel: "low" },
  { name: "Sikkim", riskLevel: "high" },
  { name: "Tamil Nadu", riskLevel: "low" },
  { name: "Telangana", riskLevel: "low" },
  { name: "Tripura", riskLevel: "moderate" },
  { name: "Uttar Pradesh", riskLevel: "low" },
  { name: "Uttarakhand", riskLevel: "high" },
  { name: "West Bengal", riskLevel: "low" },
  { name: "Delhi", riskLevel: "moderate" },
  { name: "Andaman and Nicobar Islands", riskLevel: "high" },
  { name: "Chandigarh", riskLevel: "low" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", riskLevel: "low" },
  { name: "Jammu and Kashmir", riskLevel: "high" },
  { name: "Ladakh", riskLevel: "high" },
  { name: "Lakshadweep", riskLevel: "low" },
  { name: "Puducherry", riskLevel: "low" }
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

interface StateSeismicDataProps {
  earthquakes?: Earthquake[];
}

export const StateSeismicData = ({ earthquakes }: StateSeismicDataProps) => {
  const [selectedState, setSelectedState] = useState("all");

  const getStateEarthquakes = (state: string) => {
    if (!earthquakes) return [];
    return earthquakes.filter(eq =>
      eq.place?.toLowerCase().includes(state.toLowerCase())
    );
  };

  // List of states to show based on selection, all states always shown but can optionally filter for "only one" if desired in the future
  const statesToShow = indianStates;

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
        {/* Remove select option to show ALL states at once */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statesToShow.map(state => {
            const stateEarthquakes = getStateEarthquakes(state.name);
            const riskClass = getRiskColor(state.riskLevel);

            return (
              <div
                key={state.name}
                className={`rounded-lg p-4 shadow-sm ${riskClass}`}
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
