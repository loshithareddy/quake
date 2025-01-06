import { format } from "date-fns";
import type { Earthquake } from "@/lib/types";
import { ChevronDown, Clock, History, Info, Phone, Shield, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";

interface SidebarProps {
  earthquakes?: Earthquake[];
}

const Sidebar = ({ earthquakes }: SidebarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const emergencyContacts = [
    { name: "National Emergency Number", number: "112" },
    { name: "Police", number: "100" },
    { name: "Fire", number: "101" },
    { name: "Ambulance", number: "102" },
    { name: "Disaster Management", number: "108" },
  ];

  const safetyTips = [
    "Drop, Cover, and Hold On during shaking",
    "Stay away from windows and exterior walls",
    "If outdoors, move to open areas",
    "Keep emergency supplies ready",
    "Have a family emergency plan",
  ];

  return (
    <aside className="w-96 bg-forest-light border-r border-mint/20 p-4 overflow-y-auto">
      <div className="mb-6 text-center">
        <Clock className="inline-block mr-2 text-mint" />
        <span className="text-lg font-semibold text-mint">
          {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </span>
        <div className="text-sm text-white/60">India Standard Time</div>
      </div>

      <div className="space-y-4">
        <Collapsible className="border border-mint/20 rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
            <span className="flex items-center">
              <AlertTriangle className="mr-2" />
              Recent Earthquakes
            </span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 space-y-3">
            {earthquakes?.map((eq) => (
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
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="border border-mint/20 rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
            <span className="flex items-center">
              <Phone className="mr-2" />
              Emergency Contacts
            </span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.name} className="mb-3 p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">{contact.name}</div>
                <div className="text-white/80">{contact.number}</div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="border border-mint/20 rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
            <span className="flex items-center">
              <Shield className="mr-2" />
              Safety Tips
            </span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            {safetyTips.map((tip, index) => (
              <div key={index} className="mb-3 p-3 bg-forest rounded-lg border border-mint/20">
                <p className="text-white/80">{tip}</p>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

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
              <div className="p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">2001 Gujarat Earthquake</div>
                <p className="text-white/80">Magnitude 7.7 - One of India's most devastating earthquakes</p>
              </div>
              <div className="p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">2004 Indian Ocean Earthquake</div>
                <p className="text-white/80">Magnitude 9.1 - Triggered devastating tsunamis</p>
              </div>
              <div className="p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">2015 Nepal Earthquake</div>
                <p className="text-white/80">Magnitude 7.8 - Affected parts of North India</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  );
};

export default Sidebar;