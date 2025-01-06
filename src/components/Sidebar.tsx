import { format } from "date-fns";
import type { Earthquake } from "@/lib/types";
import { Clock, History, Shield, MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmergencyContacts } from "./sidebar/EmergencyContacts";
import { LocationSeismicData } from "./sidebar/LocationSeismicData";

interface SidebarProps {
  earthquakes?: Earthquake[];
}

const Sidebar = ({ earthquakes }: SidebarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
        <LocationSeismicData earthquakes={earthquakes} />
        <EmergencyContacts />

        <Collapsible className="border border-mint/20 rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
            <span className="flex items-center">
              <MessageSquare className="mr-2" />
              Feedback
            </span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <div className="p-3 bg-forest rounded-lg border border-mint/20">
              <textarea
                placeholder="Share your feedback or report an earthquake..."
                className="w-full h-24 p-2 mb-2 bg-transparent border border-mint/20 rounded text-white resize-none"
              />
              <button
                onClick={() => toast({
                  title: "Thank you!",
                  description: "Your feedback has been submitted.",
                })}
                className="w-full p-2 bg-mint text-forest rounded hover:bg-mint/90"
              >
                Submit Feedback
              </button>
            </div>
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