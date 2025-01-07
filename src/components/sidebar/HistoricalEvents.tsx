import { ChevronDown, History } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const historicalEvents = [
  {
    name: "1960 Valdivia Earthquake (Chile)",
    magnitude: "9.5",
    description: "The most powerful earthquake ever recorded",
    region: "South America"
  },
  {
    name: "2011 Tōhoku Earthquake (Japan)",
    magnitude: "9.1",
    description: "Triggered devastating tsunami and nuclear disaster",
    region: "Asia"
  },
  {
    name: "2004 Indian Ocean Earthquake",
    magnitude: "9.1",
    description: "Triggered devastating tsunamis affecting multiple countries",
    region: "Asia"
  },
  {
    name: "1964 Alaska Earthquake",
    magnitude: "9.2",
    description: "The most powerful earthquake recorded in North America",
    region: "North America"
  },
  {
    name: "2010 Haiti Earthquake",
    magnitude: "7.0",
    description: "One of the most destructive in the Caribbean region",
    region: "Caribbean"
  },
  {
    name: "1556 Shaanxi Earthquake (China)",
    magnitude: "~8.0",
    description: "Deadliest earthquake in recorded history",
    region: "Asia"
  },
  {
    name: "1755 Lisbon Earthquake",
    magnitude: "~8.5",
    description: "Major earthquake that reshaped European history",
    region: "Europe"
  },
  {
    name: "2015 Nepal Earthquake",
    magnitude: "7.8",
    description: "Devastating earthquake in the Himalayas",
    region: "Asia"
  }
];

export const HistoricalEvents = () => {
  return (
    <Collapsible className="border border-mint/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
        <span className="flex items-center">
          <History className="mr-2" />
          Historical Events
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="space-y-3">
          {historicalEvents.map((event, index) => (
            <div key={index} className="p-3 bg-forest rounded-lg border border-mint/20">
              <div className="font-semibold text-mint">{event.name}</div>
              <div className="text-white/80">Magnitude {event.magnitude}</div>
              <p className="text-white/80">{event.description}</p>
              <span className="text-xs text-mint/60">Region: {event.region}</span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};