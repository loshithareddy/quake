
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";
import { format } from "date-fns";

export const RecentEvents = () => {
  const { data: earthquakes, isLoading } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
  });

  // Get the 5 most recent events
  const events = earthquakes?.slice(0, 5) || [];

  return (
    <Collapsible className="border border-forest/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-forest/10 text-forest hover:bg-forest/20">
        <span className="flex items-center">
          <History className="mr-2" />
          Recent Events
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-white/80">
        {isLoading ? (
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">Loading recent events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 rounded-lg shadow-sm border ${
                  event.magnitude >= 7 
                    ? 'bg-red-50 border-red-200' 
                    : event.magnitude >= 5 
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${
                    event.magnitude >= 7 
                      ? 'text-red-700' 
                      : event.magnitude >= 5 
                      ? 'text-orange-700'
                      : 'text-green-700'
                  }`}>
                    {event.magnitude >= 7 ? '⚠️' : event.magnitude >= 5 ? '⚡' : '✅'} 
                    Magnitude {event.magnitude.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-600">
                    {format(new Date(event.time), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mt-1">📍 {event.place}</p>
                <p className="text-gray-600 text-xs mt-1">Source: {event.source || 'Unknown'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">No recent events available</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
