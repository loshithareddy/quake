
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { History } from "lucide-react";
import type { Earthquake } from "@/lib/types";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";

export const RecentEvents = () => {
  const { data: earthquakes } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
    refetchInterval: 180000, // Refetch every 3 minutes
  });

  // Get the 5 most recent earthquakes
  const recentEarthquakes = earthquakes 
    ? [...earthquakes]
      .sort((a, b) => b.time - a.time)
      .slice(0, 5)
    : [];

  return (
    <Collapsible className="border border-mint/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
        <span className="flex items-center">
          <History className="mr-2" />
          Recent Events
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="space-y-3">
          {recentEarthquakes.length > 0 ? (
            recentEarthquakes.map((eq) => (
              <div key={eq.id} className="p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">
                  {eq.magnitude >= 5 
                    ? `Significant Earthquake (M${eq.magnitude.toFixed(1)})` 
                    : `M${eq.magnitude.toFixed(1)} Earthquake`}
                </div>
                <div className="text-white/80">{eq.place}</div>
                <p className="text-white/80">
                  Depth: {eq.depth}km
                </p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-mint/60">Source: {eq.source || "USGS"}</span>
                  <span className="text-xs text-mint/60">
                    {format(new Date(eq.time), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 bg-forest rounded-lg border border-mint/20 text-center">
              <p className="text-white/80">Loading recent earthquakes...</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
