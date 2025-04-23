
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";
import { format } from "date-fns";

// Some fallback demo events in case the main API has no data
const demoRecentEvents = [
  {
    id: "demo1",
    magnitude: 5.2,
    place: "Delhi, India",
    time: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: "demo2",
    magnitude: 4.8,
    place: "Imphal, Manipur, India",
    time: Date.now() - 5 * 60 * 60 * 1000
  },
  {
    id: "demo3",
    magnitude: 3.7,
    place: "Pune, Maharashtra, India",
    time: Date.now() - 9 * 60 * 60 * 1000
  }
];

export const RecentEvents = () => {
  const { data: earthquakes } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
  });

  // Get the 5 most recent events or demo if empty
  const events =
    earthquakes && earthquakes.length > 0
      ? earthquakes.slice(0, 5)
      : demoRecentEvents;

  return (
    <Collapsible className="border border-forest/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
        <span className="flex items-center">
          <History className="mr-2" />
          Recent Events
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        {events.length > 0 ? (
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="p-3 bg-forest rounded-lg border border-mint/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-white">Magnitude {event.magnitude}</span>
                  <span className="text-xs text-white/70">
                    {format(new Date(event.time), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-white/90 text-sm">{event.place}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-forest rounded-lg border border-mint/20 text-center">
            <p className="text-white/80">No recent events available.</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
