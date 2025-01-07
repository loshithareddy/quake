import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { History } from "lucide-react";

const recentEvents = [
  {
    name: "2024 Hindu Kush Earthquake",
    magnitude: "6.4",
    description: "Affected parts of Afghanistan and Northern India",
    source: "USGS",
    date: "2024-01-11"
  },
  {
    name: "2023 Nepal-India Border Earthquake",
    magnitude: "6.2",
    description: "Felt across Nepal and Northern India",
    source: "NCS",
    date: "2023-10-03"
  },
  {
    name: "2023 Gujarat Earthquake",
    magnitude: "4.8",
    description: "Epicenter in Kutch region",
    source: "IMD",
    date: "2023-07-16"
  }
];

export const RecentEvents = () => {
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
          {recentEvents.map((event, index) => (
            <div key={index} className="p-3 bg-forest rounded-lg border border-mint/20">
              <div className="font-semibold text-mint">{event.name}</div>
              <div className="text-white/80">Magnitude {event.magnitude}</div>
              <p className="text-white/80">{event.description}</p>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-mint/60">Source: {event.source}</span>
                <span className="text-xs text-mint/60">Date: {event.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};